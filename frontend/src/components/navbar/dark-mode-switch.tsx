import { SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

const themes = ['light', 'dark'];

const icons = [
  <SunIcon
    className='h-4 w-4'
    key={'light'}
  />,
  <MoonIcon
    className='h-4 w-4'
    key={'dark'}
  />
];

export function DarkMode(): JSX.Element {
  const { setTheme, theme } = useTheme();

  return (
    <div
      className='flex items-center justify-center rounded-full m-4 lg:mr-10 shadow-md py-2 bg-secondary'
      aria-label='darkMode'
    >
      {themes.map((t, i) => {
        const icon = icons[i];
        const checked = t === theme;
        return (
          <label
            title={t}
            className={(checked ? 'text-primary' : 'text-foreground') + ' py-1 px-3 opacity-50 cursor-pointer'}
            key={i}
          >
            {icon}
            <input
              type='radio'
              name='theme-toggle'
              checked={checked}
              value={t}
              aria-label={t}
              className='hidden'
              onChange={() => {
                setTheme(t);
              }}
            />
          </label>
        );
      })}
    </div>
  );
}
