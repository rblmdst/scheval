import { expect } from "chai";
import { createValidator } from "../src/index";

describe("In general", () => {
  const validatorsConfig = {
    name: {
      type: ["string", "The name must be a string"],
      required: ["The name is required"],
      min: [2, "The name must consist of 2 caracters minimum"],
      max: [30, "The name must consist of 30 caracters maximum"],
    },
    age: {
      type: ["number", "The age must be a number"],
      btw: [3, 5, "The age must be between 3 and 5"],
    },
    date: {
      type: ["string", "The filed '{{field}}' only accept string"],
      match: [
        /\d{4}-\d{2}-\d{2}/,
        "'{{value}}' is not a valid {{field}} value. The valid format is YYYY-MM-DD.",
      ],
    },
  };

  it("should retrun an empty array when the object to validate is valid", () => {
    const validator = createValidator(validatorsConfig);
    const validInput = { name: "test", age: 3 };
    const result = validator.validate(validInput);
    expect(result).to.eql([]);
  });

  it("should return an array each item of the array representing error concerning an invalid field", () => {
    const validator = createValidator(validatorsConfig);
    const invalidInput = { age: 22 };
    let result = validator.validate(invalidInput);
    expect(result).to.have.deep.members([
      { field: "name", error: "The name is required" },
      { field: "age", error: "The age must be between 3 and 5" },
    ]);
  });

  it("should support including validation details in error message using {{field}} and {{value}} placeholder", () => {
    const validator = createValidator(validatorsConfig);
    let invalidInput: any = { age: 3, name: "test", date: 2 };
    let result = validator.validate(invalidInput);
    expect(result).to.have.deep.members([
      { field: "date", error: "The filed 'date' only accept string" },
    ]);
    invalidInput = { age: 3, name: "test", date: "22-2020-02" };
    result = validator.validate(invalidInput);
    expect(result).to.have.deep.members([
      {
        field: "date",
        error:
          "'22-2020-02' is not a valid date value. The valid format is YYYY-MM-DD.",
      },
    ]);
  });

  it("should check optional field only if the value is defined i.e different from null and undefined", () => {
    const validator = createValidator(validatorsConfig);
    let input: any = { name: "test" };
    let result = validator.validate(input);
    expect(result).to.eql([]);

    input = { age: undefined, name: "test", date: null };
    result = validator.validate(input);
    expect(result).to.eql([]);

    input = { age: 36, name: "test", date: 2 };
    result = validator.validate(input);
    expect(result).to.have.deep.members([
      { field: "date", error: "The filed 'date' only accept string" },
      { field: "age", error: "The age must be between 3 and 5" },
    ]);
  });

  it("should make a field validation in the order validators were defined and stopped when first failed validation", () => {
    const customValidatorsConfig = {
      sex: {
        type: ["string", "The sex must be a string"],
        required: ["The sex is required"],
        enum: [
          ["male", "female"],
          "Sex can only takes the value 'male' or 'female'",
        ],
        max: [3, "3 caracters maximum"],
      },
    };

    const validator = createValidator(customValidatorsConfig);

    let input: any = { sex: 2 };
    let result = validator.validate(input);
    expect(result).to.have.deep.members([
      {
        field: "sex",
        error: "The sex must be a string",
      },
    ]);

    input = { sex: "M" };
    result = validator.validate(input);
    expect(result).to.have.deep.members([
      {
        field: "sex",
        error: "Sex can only takes the value 'male' or 'female'",
      },
    ]);

    input = { sex: "male" };
    result = validator.validate(input);
    expect(result).to.have.deep.members([
      {
        field: "sex",
        error: "3 caracters maximum",
      },
    ]);
  });

  it("should validate only fields defined in the validation config and ignore other fields", () => {
    const validator = createValidator(validatorsConfig);
    let input: any = { name: 2, type: "VIP", email: "test@test.test" };
    let result = validator.validate(input);
    expect(result).to.have.deep.members([
      { field: "name", error: "The name must be a string" },
    ]);
  });

  describe("Calling 'createValidator' function", () => {
    it("Should throw error when no validation error is specified for the type validation", () => {
      const customValidatorsConfig1 = {
        sex: {
          type: ["string"],
          required: ["The sex is required"],
        },
      };

      expect(function () {
        createValidator(customValidatorsConfig1);
      }).to.throw("A validation error message is required for the type.");

      const customValidatorsConfig2 = {
        sex: {
          type: ["string"],
          required: ["The sex is required"],
        },
      };

      expect(function () {
        createValidator(customValidatorsConfig2);
      }).to.throw("A validation error message is required for the type.");
    });

    it("Should throw error when no validation error is specified for the 'required' validation", () => {
      const customValidatorsConfig = {
        sex: {
          type: ["string", "Should be string"],
          required: [],
        },
      };

      expect(function () {
        createValidator(customValidatorsConfig);
      }).to.throw(
        "A validation error message is required for the 'required' field."
      );
    });

    it("Should throw error when the number of arguments required by for the validation is not equal to the expected", () => {
      const customValidatorsConfig = {
        sex: {
          type: ["string", "Should be string"],
          max: [2],
        },
      };

      expect(function () {
        createValidator(customValidatorsConfig);
      }).to.throw(
        `Invalid number of arguments. The 'max' validator of 'string' type required 2 argument(s).`
      );

      const customValidatorsConfig2 = {
        age: {
          type: ["number", "Should be number"],
          integer: [],
        },
      };

      expect(function () {
        createValidator(customValidatorsConfig2);
      }).to.throw(
        `Invalid number of arguments. The 'integer' validator of 'number' type required 1 argument(s).`
      );
    });

    it("Should throw error when the validation error message is not a string", () => {
      const customValidatorsConfig = {
        sex: {
          type: ["string", "Should be string"],
          max: [2, false],
        },
      };

      expect(function () {
        createValidator(customValidatorsConfig);
      }).to.throw("A validation error message must be a string.");

      const customValidatorsConfig2 = {
        age: {
          type: ["number", "Should be number"],
          integer: [23],
        },
      };

      expect(function () {
        createValidator(customValidatorsConfig2);
      }).to.throw("A validation error message must be a string.");
    });

    it("Should throw error when the validation key is invalid", () => {
      const customValidatorsConfig = {
        age: {
          type: ["test", "Should be number"],
        },
      };

      expect(function () {
        createValidator(customValidatorsConfig);
      }).to.throw(
        /"test" is not a validation type. The type can only take one of the following value :/
      );
    });

    it("Should throw error concernong the 'btw' when the min value of the range is greater or equal to the max value of the range", () => {
      const customValidatorsConfig = {
        age: {
          type: ["number", "Should be number"],
          btw: [18, 0, "Between 0 and 18"],
        },
      };

      expect(function () {
        createValidator(customValidatorsConfig);
      }).to.throw(
        /For range validator, the range minimum value i.e "0" must be lower than the range maximum value i.e "18"/
      );
    });

    it("Should throw error when the type (eg: string) to validate against is not specified", () => {
      const customValidatorsConfig = {
        age: {
          max: [18, 0, "Between 0 and 18"],
        },
      };

      expect(function () {
        createValidator(customValidatorsConfig);
      }).to.throw(
        /"You have to specified the type of the field "age". The type can take one of the following value /
      );
    });
  });
});
