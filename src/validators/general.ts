export const isDefined = (v: any) => {
  const valueType = typeof v;
  if (valueType === "undefined" || v === null) {
    return false;
  }
  if (valueType === "string") {
    return !!v.trim().length;
  }
  return true;
};

export const isOptional = () => {
  return "OPTIONAL";
};
