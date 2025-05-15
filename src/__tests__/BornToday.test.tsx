import { render, screen, fireEvent, act } from '@testing-library/react';
import BornToday from '../components/BornToday/BornToday';

beforeAll(() => {
  if (!HTMLElement.prototype.scrollTo) {
    HTMLElement.prototype.scrollTo = function (options?: ScrollToOptions | number, y?: number) {
      if (typeof options === 'object') {
        this.scrollLeft = (options as ScrollToOptions).left ?? 0;
      } else if (typeof options === 'number') {
        this.scrollLeft = options;
      }
    };
  }
});

describe('BornToday Component', () => {
  test('renders component and displays title', () => {
    render(<BornToday />);
    expect(screen.getByText('Born Today')).toBeInTheDocument();
  });

  test('renders all celebrities', () => {
    render(<BornToday />);
    expect(screen.getAllByRole('img')).toHaveLength(9);
    expect(screen.getByAltText('Shah Rukh Khan')).toBeInTheDocument();
  });

  test('shows scroll buttons on hover', () => {
    render(<BornToday />);
    const container = screen.getByText('Born Today').closest('.celeb-card-carousel');
    act(() => {
      fireEvent.mouseEnter(container!);
    });
    expect(screen.queryByLabelText(/Scroll (left|right)/)).toBeInTheDocument();
  });

  test('handles scroll right button click', () => {
    render(<BornToday />);
    const container = screen.getByText('Born Today').closest('.celeb-card-carousel');

    act(() => {
      fireEvent.mouseEnter(container!);
    });

    const rightButton = screen.queryByLabelText('Scroll right');
    if (rightButton) {
      fireEvent.click(rightButton);
    }
  });

  test('attaches and removes scroll event listener', () => {
    const addSpy = jest.spyOn(HTMLElement.prototype, 'addEventListener');
    const removeSpy = jest.spyOn(HTMLElement.prototype, 'removeEventListener');

    const { unmount } = render(<BornToday />);
    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  test('updates scroll position state on scroll', () => {
    render(<BornToday />);
    const carousel = document.querySelector('.carousel-track') as HTMLElement;

    Object.defineProperty(carousel, 'scrollWidth', { value: 3000, configurable: true });
    Object.defineProperty(carousel, 'clientWidth', { value: 1250, configurable: true });

    const carouselWrapper = document.querySelector('.celeb-card-carousel') as HTMLElement;
    fireEvent.mouseEnter(carouselWrapper);

    act(() => {
      carousel.scrollLeft = 100;
      fireEvent.scroll(carousel);
    });

    const rightButton = screen.queryByLabelText('Scroll right');
    expect(rightButton).toBeInTheDocument();
  });
});
