interface GoBackButtonProps {
    handleGoBack: () => void;
}

export default function GoBackButton(props: GoBackButtonProps): JSX.Element {
    const { handleGoBack } = props;
    return (
        <button
            onClick={handleGoBack}
            className='btn-primary w-max flex space-x-2'>
            <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'>
                <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18'
                />
            </svg>
            <span>Retourner à la page de sélection</span>
        </button>
    );
}
