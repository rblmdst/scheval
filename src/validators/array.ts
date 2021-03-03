export const isArray = (v: any) => {
  return Array.isArray(v);
};

export const hasMinSize = (v: any[], minSize: number) => {
  return v.length >= minSize;
};

export const hasMaxSize = (v: any[], maxSize: number) => {
  return v.length <= maxSize;
};

export const hasSize = (v: any[], size: number) => {
  return v.length === size;
};

export const isArrayOfType = (
  v: any[],
  type: "string" | "number" | "boolean" | "object"
) => {
  return v.every((x) => typeof x === type);
};

/* export const arrayIsEnumOf = (
  v: Array<string | number>,
  enums: Array<string | number>
) => {
  const valueIsInvalid = v.some(
    (x) => typeof x !== "string" && typeof x !== "number"
  );
  if (valueIsInvalid) {
    throw new Error(
      "Array enum validator can only be apply to a value that is an array of 'string' or an array of 'number'."
    );
  }
  const enumsIsInvalid = enums.some(
    (x) => typeof x !== "string" && typeof x !== "number"
  );
  if (enumsIsInvalid) {
    throw new Error(
      "The enums parameters of Array enum validator can only be an array of 'string' or an array of 'number'."
    );
  }

  return v.every((x: string | number) => enums.indexOf(x) !== -1);
}; */
