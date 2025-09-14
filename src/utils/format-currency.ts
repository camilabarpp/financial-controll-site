export const formatCurrency = (value?: number) => {
  if (value === undefined) return "Valor não definido";
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
