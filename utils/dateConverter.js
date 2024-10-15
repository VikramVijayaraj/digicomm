export function dateConverter(date) {
  const newDate = new Date(date);

  // Array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const year = newDate.getFullYear();
  const month = monthNames[newDate.getMonth()]; // Get the month name from array
  const day = newDate.getDate().toString().padStart(2, "0");
  
  const hours = newDate.getHours().toString().padStart(2, "0");
  const minutes = newDate.getMinutes().toString().padStart(2, "0");
  const seconds = newDate.getSeconds().toString().padStart(2, "0");

  const datetime = `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  return datetime;
}
