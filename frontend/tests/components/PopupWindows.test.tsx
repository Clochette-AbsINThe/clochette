import PopupWindows from '@components/PopupWindows';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

beforeAll(() => {
    render(
        <PopupWindows open={true}>
            <div>PopupWindow</div>
        </PopupWindows>
    );
});

afterEach(() => {
    render(
        <PopupWindows open={true}>
            <div>PopupWindow</div>
        </PopupWindows>
    );
});

test('Open the popup when the open props is set to true', () => {
    expect(screen.getByText('PopupWindow')).toBeInTheDocument();
});

test('close PopupWindows when ESC key is pressed', async () => {
    await userEvent.keyboard('{Escape}');
    const popupWindow = screen.queryByText('PopupWindow');
    expect(popupWindow).toBeNull();
});

test('close popupWindows when clicking outside', async () => {
    await userEvent.click(document.body);
    const popupWindow = screen.queryByText('PopupWindow');
    expect(popupWindow).toBeNull();
});

test('close popupWindows when clicking the close button', async () => {
    const closeButton = screen.getByLabelText('closeButton');
    await userEvent.click(closeButton);
    const popupWindow = screen.queryByText('PopupWindow');
    expect(popupWindow).toBeNull();
});

test("don't close popupWindows when clicking inside", async () => {
    const popupWindow = screen.getByText('PopupWindow');
    await userEvent.click(popupWindow);

    expect(screen.getByText('PopupWindow')).toBeInTheDocument();
});

test("don't close popupWindows when pressing a != Escape", async () => {
    await userEvent.keyboard('a');
    expect(screen.getByText('PopupWindow')).toBeInTheDocument();
});
