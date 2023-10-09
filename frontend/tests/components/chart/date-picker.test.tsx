import { render, screen } from '@testing-library/react';
import { format } from 'date-fns';

import { DatePickerWithRange } from '@/components/chart/date-picker';

describe('DatePickerWithRange', () => {
  it('should render the 2 dates', () => {
    const date = {
      from: new Date(2023, 0, 1, 0, 0, 0),
      to: new Date(2023, 0, 2, 0, 0, 0)
    };
    const { container } = render(
      <DatePickerWithRange
        date={date}
        setDate={vi.fn()}
      />
    );
    const printedDate = `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}`;
    expect(screen.findByText(printedDate)).not.toBeNull();
  });

  it('should render the 1 date', () => {
    const date = {
      from: new Date(2023, 0, 1, 0, 0, 0)
    };
    const { container } = render(
      <DatePickerWithRange
        date={date}
        setDate={vi.fn()}
      />
    );
    const printedDate = `${format(date.from, 'LLL dd, y')}`;
    expect(screen.findByText(printedDate)).not.toBeNull();
  });

  it('should render pick a date', () => {
    const { container } = render(
      <DatePickerWithRange
        date={undefined}
        setDate={vi.fn()}
      />
    );
    const printedDate = 'Pick a date';
    expect(screen.findByText(printedDate)).not.toBeNull();
  });
});
