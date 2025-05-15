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

  it('selects a plan and shows loading spinner in button', () => {
    renderWithRouter(<Subscription />);
  
    const starterPlan = screen.getByText('1 Day Premium');
    fireEvent.click(starterPlan);
  
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  
  it('calls createSubscription API with correct plan and redirects on success', async () => {
    const mockCheckoutUrl = 'https://checkout.example.com';
    (api.createSubscription as jest.Mock).mockResolvedValueOnce(mockCheckoutUrl);
  
    delete (window as any).location;
    (window as any).location = { href: '' };
  
    renderWithRouter(<Subscription />);
  
    fireEvent.click(screen.getByText('1 Day Premium'));
  
    const button = screen.getAllByRole('button', { name: /get started/i })[0];
    fireEvent.click(button);
  
    await waitFor(() => {
      expect(api.createSubscription).toHaveBeenCalledWith('1_day');
      expect(window.location.href).toBe(mockCheckoutUrl);
    });
  });
  

  it('does not call API when no plan is selected and button is clicked', async () => {
    renderWithRouter(<Subscription />);

    const button = screen.getAllByRole('button', { name: /get started/i })[0];
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.createSubscription).not.toHaveBeenCalled();
    });
  });

  it('allows selecting different plans and only one is selected at a time', () => {
    renderWithRouter(<Subscription />);
  
    const plan1 = screen.getByText('1 Day Premium').closest('.plan-card')!;
    const plan2 = screen.getByText('7 Day Premium').closest('.plan-card')!;
    const plan3 = screen.getByText('1 Month Premium').closest('.plan-card')!;
  
    fireEvent.click(plan1);
    expect(plan1.classList.contains('selected')).toBe(true);
    expect(plan2.classList.contains('selected')).toBe(false);
    expect(plan3.classList.contains('selected')).toBe(false);
  
    fireEvent.click(plan2);
    expect(plan1.classList.contains('selected')).toBe(false);
    expect(plan2.classList.contains('selected')).toBe(true);
    expect(plan3.classList.contains('selected')).toBe(false);
  
    fireEvent.click(plan3);
    expect(plan1.classList.contains('selected')).toBe(false);
    expect(plan2.classList.contains('selected')).toBe(false);
    expect(plan3.classList.contains('selected')).toBe(true);
  });
});
