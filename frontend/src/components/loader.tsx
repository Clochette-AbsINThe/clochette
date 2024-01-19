export default function Loader(): React.JSX.Element {
  return (
    <div className='flex justify-center items-center h-full'>
      <div
        className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2'
        aria-label='loader'
      ></div>
    </div>
  );
}
