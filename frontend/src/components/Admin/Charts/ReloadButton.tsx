interface ReloadButtonProps {
    onClick: () => void;
}

export default function ReloadButton(props: ReloadButtonProps): JSX.Element {
    const { onClick } = props;

    return (
        <button
            className='group btn-primary max-w-max p-2'
            onClick={onClick}>
            <svg
                className='w-5 h-5 transition-all duration-300 group-hover:rotate-[360deg] group-hover:scale-125'
                viewBox='0 0 24 24'>
                <g
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'>
                    <path d='M19.933 13.041a8 8 0 1 1-9.925-8.788C13.907 3.251 17.943 5.26 19.433 9'></path>
                    <path d='M20 4v5h-5'></path>
                </g>
            </svg>
        </button>
    );
}
