function getDatePartZeroFormatted(datePart) {
  return datePart > 9 ? `${datePart}` : `0${datePart}`;
}

export function formateDate(date) {
  const day = getDatePartZeroFormatted(date.getDate());
  const month = getDatePartZeroFormatted(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
