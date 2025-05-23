export const noWhiteSpace = (value: string) => {
  const whitespaceRegex = /\s/;
  return !whitespaceRegex.test(value);
};

export const isValidEmail = (value: string) => {
  const isEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return isEmailRegex.test(value);
};

export const isDiscount = (value: number) => {
  return Number.isInteger(value) && value >= 0 && value <= 100;
};

export const isQuantity = (value: number) => {
  return Number.isInteger(value) && value >= 0 && value <= 100000;
};
export const isPrice = (value: number) => {
  return Number.isInteger(value) && value >= 0 && value <= 1000000000;
};
