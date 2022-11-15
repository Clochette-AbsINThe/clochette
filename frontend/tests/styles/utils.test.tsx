import { getIcon } from '@styles/utils';
import { render, screen } from '@testing-library/react';

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

test('getIcon Misc', () => {
    render(<div>{getIcon('Misc', '')}</div>);
    const icon = screen.getByTestId('Misc');
    expect(icon).toBeInTheDocument();
});

test('getIcon Cash', () => {
    render(<div>{getIcon('Cash', '')}</div>);
    const icon = screen.getByTestId('Cash');
    expect(icon).toBeInTheDocument();
});

test('getIcon CB', () => {
    render(<div>{getIcon('CB', '')}</div>);
    const icon = screen.getByTestId('CB');
    expect(icon).toBeInTheDocument();
});

test('getIcon Lydia', () => {
    render(<div>{getIcon('Lydia', '')}</div>);
    const icon = screen.getByTestId('Lydia');
    expect(icon).toBeInTheDocument();
});

test('getIcon Setting', () => {
    render(<div>{getIcon('Setting', '')}</div>);
    const icon = screen.getByTestId('Setting');
    expect(icon).toBeInTheDocument();
});
