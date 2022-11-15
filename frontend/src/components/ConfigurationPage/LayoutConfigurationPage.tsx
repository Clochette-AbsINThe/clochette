import GoBackButton from '@components/ConfigurationPage/GoBackButton';

interface LayoutConfigurationPageProps {
    id: number | null;
    homePage: () => JSX.Element;
    itemPage: () => JSX.Element;
    handleGoBack: () => void;
}

export default function LayoutConfigurationPage(props: LayoutConfigurationPageProps): JSX.Element {
    const { id, homePage, itemPage, handleGoBack } = props;

    if (id === null) {
        // Home Page where id is null
        return homePage();
    } else if (isNaN(id)) {
        // Initial state = NaN, while id is not set, do nothing
        return <></>;
    } else {
        // Item Page where id is set
        return (
            <>
                <GoBackButton handleGoBack={handleGoBack} />
                {itemPage()}
            </>
        );
    }
}
