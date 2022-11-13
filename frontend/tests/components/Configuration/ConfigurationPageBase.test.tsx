import { addIdToUrl, ConfigurationPageHeader, getErrorMessage, getIdFromUrl, GoBackButton, removeIdFromUrl } from '@components/ConfigurationPage/ConfigurationPageBase';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('render goBackButton', async () => {
    const handleGoBack = jest.fn();
    render(<GoBackButton handleGoBack={handleGoBack} />);
    const goBackButton = screen.getByText('Retourner à la page de sélection');
    expect(goBackButton).toBeInTheDocument();
    await userEvent.click(goBackButton);
    expect(handleGoBack).toHaveBeenCalled();
});

test('render ConfigurationPageHeader', async () => {
    const callbackQuery = jest.fn();
    const changeURLwithId = jest.fn();
    render(
        <ConfigurationPageHeader
            callbackQuery={callbackQuery}
            changeURLwithId={changeURLwithId}
            description='Description'
            title='Title'
            displayItems={[]}
            loadingAllItems={false}
        >
            <div>Test</div>
        </ConfigurationPageHeader>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('search'), 'test');
    expect(callbackQuery).toHaveBeenCalledWith('test');

    await userEvent.click(screen.getByRole('button', { name: 'Ajouter un produit' }));
    expect(changeURLwithId).toHaveBeenCalledWith(-1);
});

test('test id in url', () => {
    addIdToUrl(1);
    expect(window.location.search).toEqual('?id=1');
    expect(getIdFromUrl()).toEqual(1);
    removeIdFromUrl();
    expect(window.location.search).toEqual('');
    expect(getIdFromUrl()).toEqual(null);
});

test('Not a number in url', () => {
    window.history.pushState({}, 'Test', '?id=notanumber');
    expect(getIdFromUrl()).toEqual(null);
});

describe('getErrorMessage', () => {
    test('Error 422', () => {
        expect(getErrorMessage({
            status: 422,
            data: { detail: [{ loc: [], msg: 'Error message' }] },
            statusText: '',
            headers: {},
            config: {}
        })).toEqual('Error message');
    });
    test('Error 400', () => {
        expect(getErrorMessage({
            status: 400,
            data: { detail: 'Error message' },
            statusText: '',
            headers: {},
            config: {}
        })).toEqual('Error message');
    });
    test('Error 500', () => {
        expect(getErrorMessage({
            status: 500,
            data: {},
            statusText: '',
            headers: {},
            config: {}
        })).toEqual('Erreur serveur');
    });
});
