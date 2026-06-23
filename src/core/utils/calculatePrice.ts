export const calculatePrice = (releaseDate: string | undefined): number => {
  if (!releaseDate) return 19.99;

  const releaseYear = Number(releaseDate.split("-")[0]);
  const currentYear = new Date().getFullYear();
  const age = currentYear - releaseYear;
  const basePrice = 19.99;
  const price = Math.max(4.99, basePrice - age);

  return parseFloat(price.toFixed(2));
};

export const calculateSubtotal = (prices: number[]): number => {
  const subtotal = prices.reduce((acc, price) => acc + price, 0);
  return parseFloat(subtotal.toFixed(2));
};

export const calculateTax = (subtotal: number, taxRate: number): number => {
  const tax = subtotal * taxRate;
  return parseFloat(tax.toFixed(2));
};

export const calculateTotal = (subtotal: number, tax: number): number => {
  const total = subtotal + tax;
  return parseFloat(total.toFixed(2));
};
