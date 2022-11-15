import Card from '@components/Card';
import { render, screen } from '@testing-library/react';

test('Render Card', () => {
    render(
        <Card
            description=''
            icon={['Beer']}
            link=''
            title='Test'
        />
    );
    const card = screen.queryByText('Test');
    expect(card).toBeInTheDocument();
});

test('Render Card with button label', () => {
    render(
        <Card
            description=''
            icon={['Beer']}
            link=''
            title='Test'
            buttonLabel='TestLabel'
        />
    );
    const card = screen.queryByText('TestLabel');
    expect(card).toBeInTheDocument();
});
