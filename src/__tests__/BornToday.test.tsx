import { render, screen } from '@testing-library/react';
import BornToday from '../components/BornToday/BornToday';

describe('BornToday Component', () => {
  it('renders the heading', () => {
    render(<BornToday />);
    const headingElement = screen.getByText(/Born Today/i);
    expect(headingElement).toBeInTheDocument();
  });
});
