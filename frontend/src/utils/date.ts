/**
 * Creates a Date object from a string in the format "DD/MM/YYYY HH:mm".
 * @param dateString - The string to parse.
 * @returns A Date object representing the parsed date and time.
 */
export function createDateFromString(dateString: string): Date {
  const day = parseInt(dateString.substring(0, 2));
  const month = parseInt(dateString.substring(3, 5));
  const year = parseInt(dateString.substring(6, 10));
  let hour = parseInt(dateString.substring(11, 13));
  let minute = parseInt(dateString.substring(14, 16));
  isNaN(hour) && (hour = 0);
  isNaN(minute) && (minute = 0);
  return new Date(year, month - 1, day, hour, minute);
}

/**
 * Creates a string representing a slice of 30 minutes from a given transaction date.
 * @param item - The transaction object containing the datetime property.
 * @returns A string representing the slice of 30 minutes in the format "HH:mm - HH:mm".
 */
export function createSliceOf30Minutes(item: { datetime: string }): string {
  const date = new Date(item.datetime);
  const startHour = ('00' + date.getHours()).slice(-2);
  const startMinutes = date.getMinutes() >= 30 ? '30' : '00';

  const endDate = new Date(date.getTime() + 30 * 60000);
  const endHour = ('00' + endDate.getHours()).slice(-2);
  const endMinutes = endDate.getMinutes() >= 30 ? '30' : '00';

  return `${startHour}:${startMinutes} - ${endHour}:${endMinutes}`;
}
