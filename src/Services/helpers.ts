export const isClientSide = (): boolean => typeof window !== 'undefined';

export const getLocalDateString = (): string => {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
};