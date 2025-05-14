import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import * as router from 'react-router-dom';
import Success from '../pages/SubscriptionPage/Success//Success';
import { verifySubscriptionStatusAPI } from '../API';
// import CheckCircleIcon from '../pages/SubscriptionPage/Success/CheckCirlceIcon';

// Mock dependencies
jest.mock('../API', () => ({
  verifySubscriptionStatusAPI: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));
jest.mock('../pages/SubscriptionPage/Success/CheckCirlceIcon', () => jest.fn(() => <svg data-testid="check-circle-icon" />));

// Mock window.location.href
const mockAssign = jest.fn();
Object.defineProperty(window, 'location', {
  value: { href: '', assign: mockAssign },
  writable: true,
});

// Mock console methods
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Success Component', () => {
  const mockSubscriptionDetails = {
    plan_name: 'Premium Plan',
    other_field: 'value',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (verifySubscriptionStatusAPI as jest.Mock).mockResolvedValue(mockSubscriptionDetails);
    (router.useLocation as jest.Mock).mockReturnValue({
      search: '?session_id=cs_test_123',
    });
    mockAssign.mockClear();
  });

  test('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/success?session_id=cs_test_123']}>
        <Success />
      </MemoryRouter>
    );

    expect(screen.getByText('Verifying your subscription...')).toBeInTheDocument();
    expect(screen.queryByText('Subscription Activated!')).not.toBeInTheDocument();
    expect(screen.queryByText('Subscription Error')).not.toBeInTheDocument();
  });

  test('renders success state with plan name after successful API call', async () => {
    render(
      <MemoryRouter initialEntries={['/success?session_id=cs_test_123']}>
        <Success />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(verifySubscriptionStatusAPI).toHaveBeenCalledWith('cs_test_123');
      expect(screen.getByText('Subscription Activated!')).toBeInTheDocument();
      expect(screen.getByText(/Enjoy your Premium Plan!/)).toBeInTheDocument();
      expect(screen.getByText('Start Exploring Movies')).toBeInTheDocument();
      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
      expect(screen.queryByText('Verifying your subscription...')).not.toBeInTheDocument();
    });
  });

  test('renders success state without plan name', async () => {
    (verifySubscriptionStatusAPI as jest.Mock).mockResolvedValue({ other_field: 'value' });

    render(
      <MemoryRouter initialEntries={['/success?session_id=cs_test_123']}>
        <Success />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Subscription Activated!')).toBeInTheDocument();
      expect(screen.getByText('Your subscription has been successfully activated.')).toBeInTheDocument();
      expect(screen.queryByText(/Enjoy your/)).not.toBeInTheDocument();
      expect(screen.getByText('Start Exploring Movies')).toBeInTheDocument();
    });
  });

  test('renders error state when session_id is missing', async () => {
    (router.useLocation as jest.Mock).mockReturnValue({ search: '' });

    render(
      <MemoryRouter initialEntries={['/success']}>
        <Success />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(verifySubscriptionStatusAPI).not.toHaveBeenCalled();
      expect(screen.getByText('Subscription Error')).toBeInTheDocument();
      expect(screen.getByText('No session ID found in the URL.')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.queryByText('Verifying your subscription...')).not.toBeInTheDocument();
      expect(screen.queryByText('Subscription Activated!')).not.toBeInTheDocument();
    });
  });

  test('renders error state on API failure with custom error message', async () => {
    (verifySubscriptionStatusAPI as jest.Mock).mockRejectedValue({
      response: { data: { error: 'Invalid session ID' } },
    });

    render(
      <MemoryRouter initialEntries={['/success?session_id=cs_test_123']}>
        <Success />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error verifying subscription:', expect.any(Object));
      expect(screen.getByText('Subscription Error')).toBeInTheDocument();
      expect(screen.getByText('Invalid session ID')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  test('renders error state on generic API failure', async () => {
    (verifySubscriptionStatusAPI as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(
      <MemoryRouter initialEntries={['/success?session_id=cs_test_123']}>
        <Success />
      </MemoryRouter >
    );

    await waitFor(() => {
      expect(screen.getByText('Subscription Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to verify subscription. Please try again.')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

//   test('navigates to subscription page on Try Again click in error state', async () => {
//     (router.useLocation as jest.Mock).mockReturnValue({ search: '' });

//     render(
//       <MemoryRouter initialEntries={['/success']}>
//         <Success />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByText('Try Again')).toBeInTheDocument();
//     });

//     await act(async () => {
//       await userEvent.click(screen.getByText('Try Again'));
//     });

//     expect(mockAssign).toHaveBeenCalledWith('/user/subscription');
//   });

//   test('navigates to home page on Start Exploring Movies click in success state', async () => {
//     render(
//       <MemoryRouter initialEntries={['/success?session_id=cs_test_123']}>
//         <Success />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByText('Start Exploring Movies')).toBeInTheDocument();
//     });

//     await act(async () => {
//       await userEvent.click(screen.getByText('Start Exploring Movies'));
//     });

//     expect(mockAssign).toHaveBeenCalledWith('/');
//   });

  test('handles unexpected API response structure', async () => {
    (verifySubscriptionStatusAPI as jest.Mock).mockResolvedValue(null);

    render(
      <MemoryRouter initialEntries={['/success?session_id=cs_test_123']}>
        <Success />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Subscription Activated!')).toBeInTheDocument();
      expect(screen.getByText('Your subscription has been successfully activated.')).toBeInTheDocument();
      expect(screen.queryByText(/Enjoy your/)).not.toBeInTheDocument();
    });
  });
});