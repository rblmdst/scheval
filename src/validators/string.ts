const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isString = (v: any) => {
  return typeof v === "string";
};

export const hasMinLength = (v: string, minLength: number, trim = false) => {
  return trim ? v.trim().length >= minLength : v.length >= minLength;
};

export const hasMaxLength = (v: string, maxLength: number, trim = false) => {
  return trim ? v.trim().length <= maxLength : v.length <= maxLength;
};

export const hasMatch = (v: string, pattern: RegExp) => {
  return v.match(pattern);
};

export const isEnumOf = (v: string, enums: string[]) => {
  return enums.indexOf(v) !== -1;
};

export const isEmail = (v: string) => {
  return v.match(emailPattern);
};
