import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Login.scss';
import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import { loginAPI } from '../../API';
import toast from 'react-hot-toast';

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

class Login extends React.Component {
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

        this.setState({ errors });

        if (isValid) {
            this.setState({ isLoading: true });
            const response = await loginAPI({ email, password });
            console.log("Response in LOGIN: ", response);

            

            if (response?.status === 200) {
                toast.success("Login Successfull");
            }

            this.setState({ isLoading: false });
        }
    };

    render() {
        const { showPassword, formFields, errors } = this.state;

        return (
            <Box className="login-container">
                <Box className="login-card">
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

export default Login;
