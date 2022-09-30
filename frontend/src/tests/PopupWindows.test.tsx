import { render, screen } from '@testing-library/react';
import PopupWindows from '@components/PopupWindows';

test('Render PopupWindows Button', () => {
    render(
        <PopupWindows trigger={{ className: '', content: 'TriggerButton' }}>
            <div>Test</div>
        </PopupWindows>
    );
    const popupWindows = screen.queryByRole('button', { name: 'TriggerButton' });
    expect(popupWindows).toBeInTheDocument();
});
