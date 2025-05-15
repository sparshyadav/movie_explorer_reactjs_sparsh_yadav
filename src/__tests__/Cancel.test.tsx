import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Cancel from '../pages/SubscriptionPage/Cancel/Cancel'; // adjust path if needed
import { BrowserRouter } from 'react-router-dom';
import * as API from '../API'; // adjust path if needed

// Mock API
jest.mock('../API', () => ({
  verifyCancellationStatusAPI: jest.fn(),
}));

// Mock react-router
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ search: '' }),
}));

// Utility render wrapper with routing
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Cancel Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner initially', () => {
    renderWithRouter(<Cancel />);
    expect(screen.getByText(/verifying your cancellation/i)).toBeInTheDocument();
  });

  test('renders cancellation details after API call', async () => {
    (API.verifyCancellationStatusAPI as jest.Mock).mockResolvedValue({
      plan_name: 'Premium',
      end_date: '2025-12-31',
    });

    renderWithRouter(<Cancel />);

    await waitFor(() => {
      expect(screen.getByText(/subscription cancelled/i)).toBeInTheDocument();
      expect(screen.getByText(/premium/i)).toBeInTheDocument();
      expect(screen.getByText(/december 31, 2025/i)).toBeInTheDocument();
    });
  });

  test('renders message without end date if not provided', async () => {
    (API.verifyCancellationStatusAPI as jest.Mock).mockResolvedValue({
      plan_name: 'Basic',
      end_date: undefined,
    });

    renderWithRouter(<Cancel />);

    await waitFor(() => {
      expect(screen.getByText(/basic subscription has been successfully cancelled/i)).toBeInTheDocument();
      expect(screen.queryByText(/your access will remain active until/i)).not.toBeInTheDocument();
    });
  });

  test('navigates to subscribe page on "Manage Subscription" click', async () => {
    (API.verifyCancellationStatusAPI as jest.Mock).mockResolvedValue({});

    renderWithRouter(<Cancel />);

    await waitFor(() => screen.getByText(/subscription cancelled/i));

    fireEvent.click(screen.getByText(/manage subscription/i));
    expect(mockNavigate).toHaveBeenCalledWith('/subscribe');
  });

  test('handles API error gracefully and hides loading', async () => {
    (API.verifyCancellationStatusAPI as jest.Mock).mockRejectedValue(new Error('API failure'));

    renderWithRouter(<Cancel />);

    await waitFor(() => {
      expect(screen.getByText(/subscription cancelled/i)).toBeInTheDocument();
    });
  });
});
