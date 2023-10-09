import { render, fireEvent } from '@testing-library/react';

import { DarkMode } from '@/components/navbar/dark-mode-switch';
import { ThemeProvider } from '@/components/theme-provider';

describe('DarkMode', () => {
  it('should render the component', () => {
    const { getByLabelText } = render(
      <ThemeProvider>
        <DarkMode />
      </ThemeProvider>
    );
    expect(getByLabelText('darkMode')).not.toBeNull();
  });

  it('should change the theme when a radio button is clicked', () => {
    const { getByLabelText } = render(
      <ThemeProvider>
        <DarkMode />
      </ThemeProvider>
    );
    const lightRadio = getByLabelText('light') as HTMLInputElement;
    const darkRadio = getByLabelText('dark') as HTMLInputElement;
    fireEvent.click(darkRadio);
    expect(darkRadio.checked).toBe(true);
    expect(lightRadio.checked).toBe(false);
    fireEvent.click(lightRadio);
    expect(lightRadio.checked).toBe(true);
    expect(darkRadio.checked).toBe(false);
  });
});
