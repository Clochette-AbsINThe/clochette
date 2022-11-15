export default function Page404(): JSX.Element {
    return (
        <div className='flex flex-col w-full h-full justify-between items-center grow'>
            <div className='flex items-center my-8 text-[11.5rem]'>
                <div className='opacity-0 animate-slide-in [animation-delay:_0.2s]'>4</div>
                <div className='opacity-0 animate-slide-in [animation-delay:_0.4s]'>0</div>
                <div className='opacity-0 animate-slide-in [animation-delay:_0.6s]'>4</div>
            </div>
            <h2 className='opacity-0 animate-slide-in md:text-7xl my-4 text-4xl'>PAGE NOT FOUND</h2>
            <p className='mb-20'>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
        </div>
    );
}
