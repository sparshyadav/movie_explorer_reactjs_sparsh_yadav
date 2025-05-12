import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../pages/Login/Login';
import { loginAPI } from '../API.ts';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { MemoryRouter } from 'react-router-dom';
import NavigateWrapper from '../components/NavigateWrapper';
import '@testing-library/jest-dom';

// Mock dependencies
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
        // Reset NavigateWrapper mock to pass props correctly
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

        // Initially password is hidden
        expect(passwordInput).toHaveAttribute('type', 'password');
        expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();

        // Toggle to show password
        await userEvent.click(toggleButton);
        expect(passwordInput).toHaveAttribute('type', 'text');
        expect(screen.getByTestId('eye-icon')).toBeInTheDocument();

        // Toggle back to hide password
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

    test('shows validation error for invalid email', async () => {
        render(
            <MemoryRouter>
                <Login {...defaultProps} />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });

        await userEvent.type(emailInput, 'invalid-email');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.click(loginButton);

        expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
        expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
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

    // test('handles failed login', async () => {
    //     (loginAPI as jest.Mock).mockResolvedValue(undefined);

    //     render(
    //         <MemoryRouter>
    //             <Login {...defaultProps} />
    //         </MemoryRouter>
    //     );

    //     const emailInput = screen.getByPlaceholderText('Email');
    //     const passwordInput = screen.getByPlaceholderText('Password');
    //     const loginButton = screen.getByRole('button', { name: /login/i });

    //     // await userEvent.type(emailInput, 'test@example.com');
    //     // await userEvent.type(passwordInput, 'password123');
    //     // await userEvent.click(loginButton);

    //     // await waitFor(() => {
    //     //     expect(loginAPI).toHaveBeenCalledWith({
    //     //         email: 'test@example.com',
    //     //         password: 'password123',
    //     //     });
    //     //     expect(emailInput).toHaveValue('');
    //     //     expect(passwordInput).toHaveValue('');
    //     //     expect(mockSetUser).not.toHaveBeenCalled();
    //     //     expect(Cookies.set).not.toHaveBeenCalled();
    //     //     expect(localStorage.setItem).not.toHaveBeenCalled();
    //     //     expect(mockNavigate).not.toHaveBeenCalled();
    //     //     expect(toast.success).not.toHaveBeenCalled();
    //     // });

    //     await act(async () => {
    //         await userEvent.type(emailInput, 'test@example.com');
    //         await userEvent.type(passwordInput, 'password123');
    //         await userEvent.keyboard('{Enter}');
    //     });
        
    //     await waitFor(() => {
    //         expect(loginAPI).toHaveBeenCalledWith({
    //             email: 'test@example.com',
    //             password: 'password123',
    //         });
    //         expect(mockNavigate).toHaveBeenCalledWith('/');
    //     }, { timeout: 2000 });
    // });

    test('handles failed login', async () => {
        (loginAPI as jest.Mock).mockResolvedValue(undefined); // simulate failed login
    
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
    
        await waitFor(() => {
            expect(loginAPI).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
    
            // ❌ These should NOT happen on failed login
            expect(mockSetUser).not.toHaveBeenCalled();
            expect(Cookies.set).not.toHaveBeenCalled();
            expect(localStorage.setItem).not.toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
            expect(toast.success).not.toHaveBeenCalled();
        });
    });
    

    test('triggers submit on Enter key press', async () => {
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
    
        const { container } = render(
            <MemoryRouter>
                <Login {...defaultProps} />
            </MemoryRouter>
        );
    
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
    
        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');
    
        fireEvent.keyDown(passwordInput, { key: 'Enter' });
    
        await waitFor(() => {
            expect(loginAPI).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
    
    

    test('displays loading state during submission', async () => {
        (loginAPI as jest.Mock).mockImplementation(() => new Promise(() => { })); 

        render(
            <MemoryRouter>
                <Login {...defaultProps} />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });

        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.click(loginButton);

        expect(screen.getByText('Loging In...')).toBeInTheDocument();
        expect(loginButton).toBeDisabled();
    });
});