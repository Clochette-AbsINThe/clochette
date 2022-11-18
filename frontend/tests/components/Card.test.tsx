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
