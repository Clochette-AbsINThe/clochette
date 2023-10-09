import { createDateFromString, createSliceOf30Minutes } from '@/utils/date';

describe('createDateFromString', () => {
  it('should create a Date object from a valid string', () => {
    const dateString = '01/01/2022 12:30';
    const expectedDate = new Date(2022, 0, 1, 12, 30, 0);
    expect(createDateFromString(dateString)).toEqual(expectedDate);
  });

  it('should create a Date object with default values when given an invalid string', () => {
    const dateString = 'invalid string';
    const expectedDate = new Date(NaN);
    expect(createDateFromString(dateString)).toEqual(expectedDate);
  });
});

describe('createSliceOf30Minutes', () => {
  it('before HH:30', () => {
    const transaction = { datetime: '2023-09-04T12:29:47.062000Z' };
    const expectedString = '14:00 - 14:30';
    expect(createSliceOf30Minutes(transaction)).toEqual(expectedString);
  });

  it('after HH:30', () => {
    const transaction = { datetime: '2023-09-04T12:30:47.062000Z' };
    const expectedString = '14:30 - 15:00';
    expect(createSliceOf30Minutes(transaction)).toEqual(expectedString);
  });
});