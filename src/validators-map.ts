import {
  isString,
  hasMinLength,
  hasMaxLength,
  hasMatch,
  isEnumOf,
  isDefined,
  isNumber,
  isLowerOrEqualTo,
  isGreaterOrEqualTo,
  isEqualTo,
  isGreaterThan,
  isLowerThan,
  isInteger,
  isOptional,
  isArray,
  isBoolean,
  isEmail,
  hasMinSize,
  hasMaxSize,
  isObject,
  isArrayOfType,
} from "./validators";
import { /* arrayIsEnumOf, */ hasSize } from "./validators/array";
import { isInRange } from "./validators/number";

export const validatorsMap = {
  string: {
    optional: isOptional,
    required: isDefined,
    type: isString,
    min: hasMinLength,
    max: hasMaxLength,
    match: hasMatch,
    enum: isEnumOf,
    email: isEmail,
  },
  boolean: { type: isBoolean, optional: isOptional, required: isDefined },
  number: {
    optional: isOptional,
    required: isDefined,
    type: isNumber,
    integer: isInteger,
    le: isLowerOrEqualTo,
    ge: isGreaterOrEqualTo,
    eq: isEqualTo,
    gt: isGreaterThan,
    lt: isLowerThan,
    btw: isInRange,
  },
  array: {
    type: isArray,
    optional: isOptional,
    required: isDefined,
    ofType: isArrayOfType,
    // enum: arrayIsEnumOf,
    ofMinSize: hasMinSize,
    ofMaxSize: hasMaxSize,
    ofSize: hasSize,
  },
  object: {
    type: isObject,
    optional: isOptional,
    required: isDefined,
  },
};
