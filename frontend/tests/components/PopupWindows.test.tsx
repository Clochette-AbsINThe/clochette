import PopupWindows from '@components/PopupWindows';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

beforeAll(() => {
    render(
        <PopupWindows trigger={{ className: '', content: 'TriggerButton' }}>
            <div>PopupWindow</div>
        </PopupWindows>);
});

afterEach(() => {
    render(
        <PopupWindows trigger={{ className: '', content: 'TriggerButton' }}>
            <div>PopupWindow</div>
        </PopupWindows>);
});

test('Open the popup when the open props is set to true', () => {
    render(
        <PopupWindows trigger={{ className: '', content: 'TriggerButton' }} onOpen={true}>
            <div>PopupWindow</div>
        </PopupWindows>);
    expect(screen.getByText('PopupWindow')).toBeInTheDocument();
});

test('open PopupWindows when trigger button is clicked', async () => {
    const triggerButton = screen.getByRole('button', { name: 'button-popup' });
    expect(triggerButton).toBeInTheDocument();
    await userEvent.click(triggerButton);
    const popupWindow = screen.queryByText('PopupWindow');
    expect(popupWindow).toBeInTheDocument();
});

test('close PopupWindows when ESC key is pressed', async () => {
    const triggerButton = screen.getByRole('button', { name: 'button-popup' });
    await userEvent.click(triggerButton);
    await userEvent.keyboard('{Escape}');
    const popupWindow = screen.queryByText('PopupWindow');
    expect(popupWindow).toBeNull();
});

test('close popupWindows when clicking outside', async () => {
    const triggerButton = screen.getByRole('button', { name: 'button-popup' });
    await userEvent.click(triggerButton);
    await userEvent.click(document.body);
    const popupWindow = screen.queryByText('PopupWindow');
    expect(popupWindow).toBeNull();
});

test('close popupWindows when clicking the close button', async () => {
    const triggerButton = screen.getByRole('button', { name: 'button-popup' });
    await userEvent.click(triggerButton);
    const closeButton = screen.getByLabelText('closeButton');
    await userEvent.click(closeButton);
    const popupWindow = screen.queryByText('PopupWindow');
    expect(popupWindow).toBeNull();
});

test('don\'t close popupWindows when clicking inside', async () => {
    const triggerButton = screen.getByRole('button', { name: 'button-popup' });
    await userEvent.click(triggerButton);
    const popupWindow = screen.getByText('PopupWindow');
    await userEvent.click(popupWindow);

    expect(screen.getByText('PopupWindow')).toBeInTheDocument();
});

test('don\'t close popupWindows when pressing a != Escape', async () => {
    const triggerButton = screen.getByRole('button', { name: 'button-popup' });
    await userEvent.click(triggerButton);
    await userEvent.keyboard('a');
    expect(screen.getByText('PopupWindow')).toBeInTheDocument();
});
