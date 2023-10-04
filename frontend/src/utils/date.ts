import type { Transaction } from '@/openapi-codegen/clochetteSchemas';

export function createDateFromString(dateString: string): Date {
  const day = parseInt(dateString.substring(0, 2));
  const month = parseInt(dateString.substring(3, 5));
  const year = parseInt(dateString.substring(6, 10));
  let hour = parseInt(dateString.substring(12, 14));
  let minute = parseInt(dateString.substring(15, 17));
  isNaN(hour) && (hour = 0);
  isNaN(minute) && (minute = 0);
  return new Date(year, month - 1, day, hour, minute);
}

export function createSliceOf30Minutes(item: Transaction): string {
  const date = new Date(item.datetime);
  const startHour = ('00' + date.getHours()).slice(-2);
  const startMinutes = date.getMinutes() >= 30 ? '30' : '00';

  const endDate = new Date(date.getTime() + 30 * 60000);
  const endHour = ('00' + endDate.getHours()).slice(-2);
  const endMinutes = endDate.getMinutes() >= 30 ? '30' : '00';

  return `${startHour}:${startMinutes} - ${endHour}:${endMinutes}`;
}
