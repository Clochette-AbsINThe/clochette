import ConfigurationPageHeader from '@components/ConfigurationPage/ConfigurationPageHeader';
import GoBackButton from '@components/ConfigurationPage/GoBackButton';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addIdToUrl, getErrorMessage, getIdFromUrl, removeIdFromUrl } from '@utils/utils';

test('render goBackButton', async () => {
    const handleGoBack = vi.fn();
    render(<GoBackButton handleGoBack={handleGoBack} />);
    const goBackButton = screen.getByText('Retourner à la page de sélection');
    expect(goBackButton).toBeInTheDocument();
    await userEvent.click(goBackButton);
    expect(handleGoBack).toHaveBeenCalled();
});

test('render ConfigurationPageHeader', async () => {
    const callbackQuery = vi.fn();
    const changeURLwithId = vi.fn();
    render(
        <ConfigurationPageHeader
            callbackQuery={callbackQuery}
            changeURLwithId={changeURLwithId}
            description='Description'
            title='Title'
            displayItems={[]}
            loadingAllItems={false}>
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
