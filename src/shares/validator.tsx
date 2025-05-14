
export const noWhiteSpace = (value : string) => {
  const whitespaceRegex = /\s/;
  return !whitespaceRegex.test(value);
}

export const isValidEmail = ( value: string) => {
  const isEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return isEmailRegex.test(value);
}

export const isDiscount = ( value: number) => {
  const isDiscountRegex = /^(100|[1-9]?[0-9])$/;
  return isDiscountRegex.test(value);
}

export const isQuantity = ( value: number ) => {
  const isQuantityRegex = /^(100000|[1-9]?[0-9])$/;
  return isQuantityRegex.test(value)
}

export const isPrice = ( value : number) => {
  const isPriceRegex = /^(1000000000|[1-9]?[0-9])$/;
  return isPriceRegex.test(value);
}