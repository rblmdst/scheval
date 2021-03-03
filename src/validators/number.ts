export const isNumber = (v: any) => {
  return (
    (v !== Infinity &&
      v !== -Infinity &&
      typeof v === "number" &&
      !Number.isNaN(v)) ||
    (typeof v === "string" && v.trim() !== "" && !Number.isNaN(+v))
  );
};

export const isInteger = (v: any) => {
  return Number.isInteger(+v);
};

export const isGreaterThan = (v: number, valueToCompareWith: number) => {
  return +v > +valueToCompareWith;
};
export const isGreaterOrEqualTo = (v: number, valueToCompareWith: number) => {
  return +v >= +valueToCompareWith;
};

export const isLowerThan = (v: number, valueToCompareWith: number) => {
  return +v < +valueToCompareWith;
};
export const isLowerOrEqualTo = (v: number, valueToCompareWith: number) => {
  return +v <= +valueToCompareWith;
};

export const isEqualTo = (v: number, valueToCompareWith: number) => {
  return +v == +valueToCompareWith;
};

export const isInRange = (v: number, min: number, max: number) => {
  return +v >= +min && +v <= +max;
};
