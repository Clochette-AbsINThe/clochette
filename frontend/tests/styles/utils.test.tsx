import { render } from '@testing-library/react';

import { PlusCircledIcon, DecreasingArrowIcon, IncreaseArrowIcon, MinusCircledIcon, getIcon } from '@/styles/utils';

describe('getIcon', () => {
  it('should render the Glass icon', () => {
    const { container } = render(getIcon('Glass'));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the Beer icon', () => {
    const { container } = render(getIcon('Beer'));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the Food icon', () => {
    const { container } = render(getIcon('Food'));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the Soft icon', () => {
    const { container } = render(getIcon('Soft'));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the Barrel icon', () => {
    const { container } = render(getIcon('Barrel'));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the Misc icon', () => {
    const { container } = render(getIcon('Misc'));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the Lydia icon', () => {
    const { container } = render(getIcon('Lydia'));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the Cash icon', () => {
    const { container } = render(getIcon('Cash'));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the CB icon', () => {
    const { container } = render(getIcon('CB'));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the Virement icon', () => {
    const { container } = render(getIcon('Virement'));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the Settings icon', () => {
    const { container } = render(getIcon('Setting'));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the Increase Arrow icon', () => {
    const { container } = render(<IncreaseArrowIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the Decrease Arrow icon', () => {
    const { container } = render(<DecreasingArrowIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the Plus Cicrled icon', () => {
    const { container } = render(<PlusCircledIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the Minus Cicrled icon', () => {
    const { container } = render(<MinusCircledIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
