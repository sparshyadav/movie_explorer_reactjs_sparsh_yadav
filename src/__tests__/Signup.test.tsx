import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../pages/Signup/Signup';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-hot-toast');
jest.mock('../API', () => ({
  signupAPI: jest.fn()
}));

const mockNavigate = jest.fn();

const renderWithRouter = () =>
  render(<BrowserRouter><Signup navigate={mockNavigate} /></BrowserRouter>);

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input fields and button', () => {
    renderWithRouter();

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create an account/i })).toBeInTheDocument();
  });

  it('shows error messages for empty form submission', async () => {
    renderWithRouter();

    fireEvent.click(screen.getByRole('button', { name: /create an account/i }));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByText('Phone Number is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('Confirm password is required')).toBeInTheDocument();
    });
  });

  it('shows invalid email and password error', async () => {
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalidemail' } });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'pass123' } });

    fireEvent.click(screen.getByRole('button', { name: /create an account/i }));

    await waitFor(() => {
      expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
      expect(screen.getByText('Enter a valid phone number')).toBeInTheDocument();
      expect(screen.getByText(/Password must contain/i)).toBeInTheDocument();
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('toggles password visibility', () => {
    renderWithRouter();

    const passwordToggleButtons = screen.getAllByRole('button');

    fireEvent.click(passwordToggleButtons[0]); 
    fireEvent.click(passwordToggleButtons[1]); 

    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
