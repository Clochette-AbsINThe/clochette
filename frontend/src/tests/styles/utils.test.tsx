import { render, screen } from '@testing-library/react';
import { getIcon } from '@styles/utils';

test('getIcon Glass', () => {
    render(<div>{getIcon('Glass', '')}</div>);
    const icon = screen.getByTestId('Glass');
    expect(icon).toBeInTheDocument();
});

test('getIcon Beer', () => {
    render(<div>{getIcon('Beer', '')}</div>);
    const icon = screen.getByTestId('Beer');
    expect(icon).toBeInTheDocument();
});

test('getIcon Food', () => {
    render(<div>{getIcon('Food', '')}</div>);
    const icon = screen.getByTestId('Food');
    expect(icon).toBeInTheDocument();
});

test('getIcon Soft', () => {
    render(<div>{getIcon('Soft', '')}</div>);
    const icon = screen.getByTestId('Soft');
    expect(icon).toBeInTheDocument();
});

test('getIcon Barrel', () => {
    render(<div>{getIcon('Barrel', '')}</div>);
    const icon = screen.getByTestId('Barrel');
    expect(icon).toBeInTheDocument();
});

test('getIcon null', () => {
    render(<div>{getIcon(null, '')}</div>);
    const icon = screen.queryByLabelText('icon');
    expect(icon).toBeNull();
});
