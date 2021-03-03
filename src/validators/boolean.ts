export const isBoolean = (v: any) => {
  return typeof v === "boolean";
};

export const isTrue = (v: any) => {
  return typeof v === "boolean" && v;
};

export const isFalse = (v: any) => {
  return typeof v === "boolean" && !v;
};

export const isTruthy = (v: any) => {
  return typeof v === "boolean" && !!v;
};

export const isFalsy = (v: any) => {
  return typeof v === "boolean" && !!!v;
};
