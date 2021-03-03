import { validatorsMap } from "./validators-map";
const createFieldValidator = (
  fieldConfig: { [k: string]: any[] },
  fieldName: string
) => {
  /* if(!Object.is(fieldConfig)) {
      throw new Error("The fieldConfig object must be an object.")
    } */
  // list of function to be called in sequence when user call validate
  const validationsPipeLine: Array<(v: any) => null | string> = [];

  const requiredValidationOptions = fieldConfig["required"];
  const typeValidationOptions = fieldConfig["type"];

  if (!typeValidationOptions) {
    throw new Error(
      `"You have to specified the type of the field "${fieldName}". The type can take one of the following value : "${Object.keys(
        validatorsMap
      ).join('" | "')}"`
    );
  }

  const type: keyof typeof validatorsMap = typeValidationOptions[0]; // 'string' | 'boolean' | 'array' ...
  const typeErrorMsg = typeValidationOptions[1];

  if (!(type in validatorsMap)) {
    throw Error(
      `"${type}" is not a validation type. The type can only take one of the following value : "${Object.keys(
        validatorsMap
      ).join('" | "')}"`
    );
  }
  if (!typeErrorMsg) {
    throw Error(`A validation error message is required for the type.`);
  }

  // validators available for selected type
  const availableValidators = validatorsMap[type];

  const validatorKeys = Object.keys(fieldConfig).filter(
    (k) => k != "type" && k != "required"
  );

  const typeValidationFunc = availableValidators["type"]; // eg: isString | isBoolean

  // if the field is config as required
  if (requiredValidationOptions) {
    const requiredErrorMsg = requiredValidationOptions[0];
    if (!requiredErrorMsg) {
      throw Error(
        `A validation error message is required for the 'required' field.`
      );
    }
    const requiredValidationFunc = availableValidators["required"]; // eg: isString | isBoolean

    // the type validation function (eg: isString()) should be the first one to be called
    validationsPipeLine.push((valueToValidate) => {
      const isValid = requiredValidationFunc(valueToValidate);
      return isValid ? null : requiredErrorMsg;
    });
  } else {
    // when is optional
    const optionalValidationFunc = availableValidators["optional"];
    // no need to pass the "valueToValidate" value here optional function return 'OPTIONAL' no matter the value passed
    validationsPipeLine.push(() => {
      return optionalValidationFunc();
    });
  }

  // the type validation function (eg: isString()) should be the first one or second one (if case field is set as required ) to be called
  validationsPipeLine.push((valueToValidate) => {
    const isValid = typeValidationFunc(valueToValidate);
    return isValid ? null : typeErrorMsg;
  });

  validatorKeys.forEach((key) => {
    const validatorFunction = (availableValidators as any)[key]; // 'isString' | 'hasMinLength' etc..
    if (!validatorFunction || typeof validatorFunction !== "function") {
      throw Error(
        `"${key}" is not a possible validation key of the type "${type}". Possible value are : "${Object.keys(
          availableValidators
        ).join('" | "')}"`
      );
    }

    const validationOptions = fieldConfig[key];

    const expectNumberOfParams = validatorFunction.length;

    if (validationOptions.length !== expectNumberOfParams) {
      // hasMinLength and hasMaxLength can take 2 or 3 params
      if (
        (validatorFunction.name === "hasMinLength" ||
          validatorFunction.name === "hasMaxLength") &&
        (validationOptions.length < expectNumberOfParams - 1 ||
          validationOptions.length > expectNumberOfParams)
      ) {
        throw new Error(
          `Invalid number of arguments. The '${key}' validator of '${type}' type required ${
            expectNumberOfParams - 1
          } argument(s).`
        );
      } else if (
        validatorFunction.name !== "hasMinLength" &&
        validatorFunction.name !== "hasMaxLength"
      ) {
        throw new Error(
          `Invalid number of arguments. The '${key}' validator of '${type}' type required ${expectNumberOfParams} argument(s).`
        );
      }
    }

    // all items before the last item represent arguments to pass to validation function
    const validationFuncArgs = validationOptions.slice(
      0,
      validationOptions.length - 1
    );

    if (validatorFunction.name === "isInRange") {
      const [min, max] = validationFuncArgs;
      if (min > max) {
        throw new Error(
          `For range validator, the range minimum value i.e "${max}" must be lower than the range maximum value i.e "${min}"`
        );
      }
    }

    // last item represent the error message to return
    const errorMsg = validationOptions[validationOptions.length - 1];
    if (typeof errorMsg !== "string") {
      throw Error(`A validation error message must be a string.`);
    }

    validationsPipeLine.push((valueToValidate) => {
      const isValid = validatorFunction(valueToValidate, ...validationFuncArgs);
      return isValid ? null : errorMsg;
    });
  });

  return validationsPipeLine;
};

const createFieldsValidator = (configObject: {
  [k: string]: { [k: string]: any[] };
}) => {
  const allFieldsValidator: {
    [k: string]: ReturnType<typeof createFieldValidator>;
  } = {};
  for (let field in configObject) {
    const fieldConfig = configObject[field];
    allFieldsValidator[field] = createFieldValidator(fieldConfig, field);
  }
  return allFieldsValidator;
};

export const createValidator = (configObject: {
  [k: string]: { [k: string]: any[] };
}) => {
  const fieldsValidator = createFieldsValidator(configObject);

  const validate = (objectToValidate: { [k: string]: any }) => {
    const fieldsToValidate = Object.keys(configObject);
    // create a new object with only fields to validate
    const objectWithFieldsToValidate: { [k: string]: any } = {};
    fieldsToValidate.forEach((field) => {
      /* // we will only validate field that exists in the object to validate and that are configured to be validate
      if (field in fieldsValidator && field in objectToValidate) {
        objectWithFieldsToValidate[field] = objectToValidate[field];
      } */
      objectWithFieldsToValidate[field] = objectToValidate[field];
    });

    const errors = [];
    for (let field in objectWithFieldsToValidate) {
      const validatorPipeline = fieldsValidator[field];
      const valueToValidate = objectWithFieldsToValidate[field];

      /* const currentFieldValidationErrors = (validatorPipeline as Array<
        (value) => string | null
      >).reduce((errMsgs, validationFunc, i, array) => {
        const errMsg = validationFunc(valueToValidate);
        errMsg && errMsgs.push(errMsg);

        // force to abort: pseudo break
        return errMsgs;
      }, []); */

      const validationFunc = validatorPipeline[0];
      const currentFieldErrMsg = validationFunc(valueToValidate);

      let start = 0;
      if (currentFieldErrMsg == "OPTIONAL") {
        const valueType = typeof valueToValidate;
        // do not enter the validation pipeline if a field is optional (i.e not set as required in the config) and the value of the field is not defined
        if (valueType === "undefined" || valueToValidate === null) {
          start = validatorPipeline.length; // move the pipeline stage cursor to index greater that the max possible index so that the pipeline loop is not executed
        } else {
          // the first (index == 0 ) pipeline function is the optional validator in case the field is not set as required
          // so move the pipeline stage cursor to index == 1 if the value is optional but user defined his value
          start = 1;
        }
      }

      // pipeline loop
      for (let i = start; i < validatorPipeline.length; i++) {
        const validationFunc = validatorPipeline[i];
        const currentFieldErrMsg = validationFunc(valueToValidate);
        if (currentFieldErrMsg) {
          errors.push({
            field,
            error: currentFieldErrMsg
              .replace(/\{\{field\}\}/g, field)
              .replace(/\{\{value\}\}/g, valueToValidate),
          });
          break;
        }
      }
    }

    return errors;
  };

  return {
    validate,
  };
};
