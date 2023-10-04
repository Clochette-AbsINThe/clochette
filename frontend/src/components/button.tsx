import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  confirm?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  retour?: boolean;
}

export const Button = ({ children, onClick, danger, disabled, type, confirm, loading, retour, ...rest }: ButtonProps) => {
  const _danger = danger ?? false;
  const _confirm = confirm ?? false;
  const _disabled = (disabled || loading) ?? false;

  const className =
    'text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition ease-in duration-200 rounded-md shadow-md transform enabled:hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-1';

  let specificClassName = '';
  if (_danger) {
    specificClassName = 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90';
  } else if (_confirm) {
    specificClassName = 'bg-cyan-600 text-white hover:bg-cyan-700 disabled:bg-cyan-800 border-cyan-600 focus:outline-cyan-600';
  } else {
    specificClassName = 'bg-primary text-primary-foreground shadow hover:bg-primary/90';
  }

  return (
    <button
      className={twMerge(className, specificClassName)}
      disabled={_disabled}
      type={type}
      onClick={onClick}
      {...rest}
    >
      <div className='px-4 py-2 flex justify-center'>
        <Return retour={retour} />
        {children}
        <Loading loading={loading} />
      </div>
    </button>
  );
};

function Loading({ loading }: { loading?: boolean }) {
  if (loading === undefined || !loading) return <></>;
  return (
    <svg
      className='animate-spin mx-5 h-5 w-5 text-primary-foreground'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
      ></circle>
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      ></path>
    </svg>
  );
}

function Return({ retour }: { retour?: boolean }) {
  if (retour === undefined || !retour) return <></>;
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='mr-4 h-6 w-6 fill-primary-foreground'
    >
      <path d='M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z' />
      <path d='M13.293 7.293 8.586 12l4.707 4.707 1.414-1.414L11.414 12l3.293-3.293-1.414-1.414z' />
    </svg>
  );
}
