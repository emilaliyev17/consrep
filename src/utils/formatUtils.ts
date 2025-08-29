export const formatNumber = (value: number | string): string => {
  if (value === null || value === undefined || isNaN(Number(value))) return '0.00';
  
  const numValue = Number(value);

  // Round to 2 decimal places
  const rounded = Math.round(numValue * 100) / 100;
  
  // Format with thousand separators
  return rounded.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};