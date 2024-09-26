export function dateConverter(date) {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = newDate.getMonth().toString().padStart(2, 0);
  const day = newDate.getDate().toString().padStart(2, 0);
  const hours = newDate.getHours().toString().padStart(2, 0);
  const minutes = newDate.getMinutes().toString().padStart(2, 0);
  const seconds = newDate.getSeconds().toString().padStart(2, 0);

  const datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return datetime;
}
