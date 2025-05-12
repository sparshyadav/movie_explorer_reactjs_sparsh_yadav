import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../pages/Login/Login';
import { loginAPI } from '../API.ts';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { MemoryRouter } from 'react-router-dom';
import NavigateWrapper from '../components/NavigateWrapper';
import '@testing-library/jest-dom';

jest.mock('../API', () => ({
    loginAPI: jest.fn(),
}));
jest.mock('js-cookie', () => ({
    set: jest.fn(),
}));
jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
}));
jest.mock('lucide-react', () => ({
    Eye: () => <svg data-testid="eye-icon" />,
    EyeOff: () => <svg data-testid="eye-off-icon" />,
}));
jest.mock('../components/NavigateWrapper', () => {
    return jest.fn((Component) => (props) => <Component {...props} navigate={jest.fn()} />);
});

const store: Record<string, string> = {};

Object.defineProperty(window, 'localStorage', {
    value: {
        setItem: jest.fn((key, value) => {
            store[key] = value?.toString?.() ?? '';
        }),
        getItem: jest.fn((key) => store[key] || null),
        clear: jest.fn(() => {
            for (let key in store) {
                delete store[key];
            }
        }),
        removeItem: jest.fn((key) => {
            delete store[key];
        }),
    },
    writable: true,
});

describe('Login Component', () => {
    const mockNavigate = jest.fn();
    const mockSetUser = jest.fn();
    const userContext = {
        setUser: mockSetUser,
        user: { email: '', mobile_number: '', name: '', role: '' },
    };

    const defaultProps = {
        navigate: mockNavigate,
        userContext,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (NavigateWrapper as jest.Mock).mockImplementation((Component) => (props) => (
            <Component {...props} navigate={mockNavigate} />
        ));
    });

    test('renders login form correctly', () => {
        render(
            <MemoryRouter>
                <Login {...defaultProps} />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByText('Become a Member?')).toBeInTheDocument();
    });

    test('updates email and password inputs on change', async () => {
        render(
            <MemoryRouter>
                <Login {...defaultProps} />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');

        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    test('toggles password visibility', async () => {
        render(
            <MemoryRouter>
                <Login {...defaultProps} />
            </MemoryRouter>
        );

        const passwordInput = screen.getByPlaceholderText('Password');
        const toggleButton = screen.getByTestId('eye-off-icon').parentElement!;

        expect(passwordInput).toHaveAttribute('type', 'password');
        expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();

        await userEvent.click(toggleButton);
        expect(passwordInput).toHaveAttribute('type', 'text');
        expect(screen.getByTestId('eye-icon')).toBeInTheDocument();

        await userEvent.click(toggleButton);
        expect(passwordInput).toHaveAttribute('type', 'password');
        expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
    });

    test('shows validation errors for empty fields', async () => {
        render(
            <MemoryRouter>
                <Login {...defaultProps} />
            </MemoryRouter>
        );

        const loginButton = screen.getByRole('button', { name: /login/i });
        await userEvent.click(loginButton);

        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    test('handles successful login', async () => {
        const mockResponse = {
            status: 200,
            data: {
                email: 'test@example.com',
                mobile_number: '1234567890',
                name: 'Test User',
                role: 'admin',
                token: 'mock-token',
            },
        };
        (loginAPI as jest.Mock).mockResolvedValue(mockResponse);

        render(
            <MemoryRouter>
                <Login {...defaultProps} />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });

        await act(async () => {
            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.type(passwordInput, 'password123');
            await userEvent.click(loginButton);
        });

        await waitFor(
            () => {
                expect(loginAPI).toHaveBeenCalledWith({
                    email: 'test@example.com',
                    password: 'password123',
                });
                expect(mockSetUser).toHaveBeenCalledWith({
                    email: 'test@example.com',
                    mobile_number: '1234567890',
                    name: 'Test User',
                    role: 'admin',
                });
                expect(Cookies.set).toHaveBeenCalledWith('authToken', 'mock-token', {
                    expires: 7,
                    secure: true,
                    sameSite: 'Strict',
                });
                expect(localStorage.setItem).toHaveBeenCalledWith('role', 'admin');
                expect(mockNavigate).toHaveBeenCalledWith('/');
                expect(toast.success).toHaveBeenCalledWith('Login Successfull');
            },
            { timeout: 1000 }
        );
    });
});