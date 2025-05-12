import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Subscription from '../components/Subscription/Subscription';
import { BrowserRouter } from 'react-router-dom';
import * as api from '../API';

jest.mock('../API', () => ({
  createSubscription: jest.fn(),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Subscription Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all subscription plans', () => {
    renderWithRouter(<Subscription />);

    expect(screen.getByText('1 Day Premium')).toBeInTheDocument();
    expect(screen.getByText('7 Day Premium')).toBeInTheDocument();
    expect(screen.getByText('1 Month Premium')).toBeInTheDocument();
  });

  it('selects a plan and updates button text to "Selected"', () => {
    renderWithRouter(<Subscription />);

    const starterPlan = screen.getByText('1 Day Premium');
    fireEvent.click(starterPlan);

    expect(screen.getAllByText('Selected')[0]).toBeInTheDocument();
  });

  it('calls createSubscription API with correct plan and redirects on success', async () => {
    const mockCheckoutUrl = 'https://checkout.example.com';
    (api.createSubscription as jest.Mock).mockResolvedValueOnce(mockCheckoutUrl);

    delete (window as any).location;
    (window as any).location = { href: '' };

    renderWithRouter(<Subscription />);

    const starterPlan = screen.getByText('1 Day Premium');
    fireEvent.click(starterPlan);

    const button = screen.getAllByRole('button', { name: /selected/i })[0];
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.createSubscription).toHaveBeenCalledWith('1_day');
      expect(window.location.href).toBe(mockCheckoutUrl);
    });
  });
});
