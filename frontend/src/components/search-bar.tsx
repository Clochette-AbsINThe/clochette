interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
}

export default function SearchBar({ query, setQuery }: SearchBarProps): React.JSX.Element {
  return (
    <div className='w-full max-w-xs md:max-w-3xl mr-4'>
      <label
        htmlFor='input-group-search'
        className='sr-only'
      >
        Search
      </label>
      <div className='relative'>
        <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
          <svg
            className='w-5 h-5 text-gray-500 dark:text-gray-400'
            aria-hidden='true'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
              clipRule='evenodd'
            ></path>
          </svg>
        </div>
        <input
          type='text'
          id='input-group-search'
          name='input-group-search'
          aria-label='search'
          className='block p-2 w-full pl-10 shadow-md text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
          placeholder={'Rechercher '}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
