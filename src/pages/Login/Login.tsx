import { Eye, EyeOff } from 'lucide-react';
import './Login.scss';
import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import { loginAPI } from '../../API';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import NavigateWrapper from '../../components/NavigateWrapper';
import React from 'react';

type State = {
    showPassword: boolean;
    isLoading: boolean;
    formFields: {
        email: string;
        password: string;
    };
    errors: {
        emailError?: string;
        passwordError?: string;
    };
};

type User = {
    email: string;
    mobile_number: string;
    name: string;
    role: string;
}

type Props = {
    navigate: (path: string) => void;
    userContext: {
        setUser: (user: User) => void;
        user: User;
    }
};

class Login extends React.Component<Props> {
    state: State = {
        showPassword: false,
        isLoading: false,
        formFields: {
            email: '',
            password: ''
        },
        errors: {},
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.state.errors = {};
        this.state.isLoading = false;
        const { name, value } = e.target;

        this.setState((prevState: State) => ({
            formFields: {
                ...prevState.formFields,
                [name]: value,
            },
        }));
    };

    handleSubmit = async () => {
        const { email, password } = this.state.formFields;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const errors: State['errors'] = {};

        let isValid: boolean = true;

        if (!email) {
            errors.emailError = 'Email is required';
            isValid = false;
        }
        else if (!emailRegex.test(email)) {
            errors.emailError = 'Enter a valid email';
            isValid = false;
        }

        if (!password) {
            errors.passwordError = 'Password is required';
            isValid = false;
        }

        this.setState({ errors });

        if (isValid) {
            this.setState({ isLoading: true });
            const response = await loginAPI({ email, password });

            if (response && response.data) {
                this.props.userContext.setUser({
                    email: response.data.email,
                    mobile_number: response.data.mobile_number,
                    role: response.data.role,
                    name: response.data.name
                });
            }

            const token = response?.data?.token;
            if (token) {
                Cookies.set('authToken', token, {
                    expires: 7,
                    secure: true,
                    sameSite: 'Strict',
                });
            }

            localStorage.setItem("role", response?.data.role);

            if (response?.status === 200) {
                this.props.navigate('/')
                toast.success("Login Successfull");
            }

            if (response === undefined) {
                this.setState({ isLoading: false });
                this.state.formFields.email = '';
                this.state.formFields.password = '';
            }
        }
    };

    handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    };

    render() {
        const { showPassword, formFields, errors } = this.state;

        return (
            <Box className="login-container">
                <Box className="login-card" onKeyDown={this.handleKeyDown}>
                    <h1 className="login-title">Login</h1>

                    <Box className="form-group">
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={formFields.email}
                            onChange={this.handleChange}
                        />
                        {errors.emailError && <p className="error">{errors.emailError}</p>}
                    </Box>

                    <Box className='password-main-container'>
                        <Box className="password-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={formFields.password}
                                onChange={this.handleChange}
                            />
                            <button type="button" onClick={() => this.setState({ showPassword: !showPassword })}>
                                {showPassword ? <Eye color="#F5C518" /> : <EyeOff color="#F5C518" />}
                            </button>
                        </Box>
                        {errors.passwordError && <p className="error">{errors.passwordError}</p>}
                    </Box>

                    <button
                        className={`login-btn ${this.state.isLoading ? 'loading' : ''}`}
                        onClick={this.handleSubmit}
                        disabled={this.state.isLoading}
                    >
                        {this.state.isLoading ? (
                            <span className="loader">Loging In...</span>
                        ) : (
                            'Login'
                        )}
                    </button>

                    <p className="login-link">
                        Become a Member? <NavLink to={'/signup'}><span>Signup</span></NavLink>
                    </p>
                </Box>
            </Box>
        );
    }
}

export default NavigateWrapper(Login);
