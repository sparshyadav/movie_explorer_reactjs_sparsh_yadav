import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Box from '@mui/material/Box';
import './Signup.scss';
import { NavLink } from 'react-router-dom';

type State = {
    showPassword: boolean;
    showConfirmPassword: boolean;
    formFields: {
        email: string;
        username: string;
        phoneNumber: string;
        password: string;
        confirmPassword: string;
    };
    errors: {
        emailError?: string;
        usernameError?: string;
        phoneNumberError?: string;
        passwordError?: string;
        confirmPasswordError?: string;
    };
};

class Signup extends React.Component {
    state: State = {
        showPassword: false,
        showConfirmPassword: false,
        formFields: {
            email: '',
            username: '',
            phoneNumber: "",
            password: '',
            confirmPassword: '',
        },
        errors: {},
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        this.setState((prevState: State) => ({
            formFields: {
                ...prevState.formFields,
                [name]: value,
            },
        }));
    };

    handleSubmit = () => {
        const { email, username, phoneNumber, password, confirmPassword } = this.state.formFields;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^_-])[A-Za-z\d@$!%*?#&^_-]{8,}$/;
        const phoneNumberRegex = /^[7-9][0-9]{9}$/;

        const errors: State['errors'] = {};

        if (!email) errors.emailError = 'Email is required';
        else if (!emailRegex.test(email)) errors.emailError = 'Enter a valid email';

        if (!username) errors.usernameError = 'Username is required';

        if (!phoneNumber) errors.phoneNumberError = 'Phone Number is required';
        else if (!phoneNumberRegex.test(phoneNumber)) errors.phoneNumberError = 'Enter a valid phone number'

        if (!password) errors.passwordError = 'Password is required';
        else if (!passwordRegex.test(password))
            errors.passwordError =
                'Password must contain 8 characters, a number, a special character, an uppercase and a lowercase letter';

        if (!confirmPassword) errors.confirmPasswordError = 'Confirm password is required';
        else if (password !== confirmPassword)
            errors.confirmPasswordError = 'Passwords do not match';

        this.setState({ errors });
    };

    render() {
        const { showPassword, showConfirmPassword, formFields, errors } = this.state;

        return (
            <Box className="signup-container">
                <Box className="signup-card">
                    <h1 className="signup-title">Sign Up</h1>

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

                    <Box className="form-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formFields.username}
                            onChange={this.handleChange}
                        />
                        {errors.usernameError && <p className="error">{errors.usernameError}</p>}
                    </Box>

                    <Box className="form-group">
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formFields.phoneNumber}
                            onChange={this.handleChange}
                        />
                        {errors.phoneNumberError && <p className="error">{errors.phoneNumberError}</p>}
                    </Box>

                    <Box className='password-container'>
                        <div className="password-group">
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
                        </div>
                        {errors.passwordError && <p className="error">{errors.passwordError}</p>}
                    </Box>

                    <Box className='password-container'>
                        <div className="password-group">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formFields.confirmPassword}
                                onChange={this.handleChange}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    this.setState({ showConfirmPassword: !showConfirmPassword })
                                }
                            >
                                {showConfirmPassword ? <Eye color="#F5C518" /> : <EyeOff color="#F5C518" />}
                            </button>

                        </div>
                        {errors.confirmPasswordError && (
                            <p className="error">{errors.confirmPasswordError}</p>
                        )}
                    </Box>

                    <button className="signup-btn" onClick={this.handleSubmit}>
                        Create Account
                    </button>

                    <p className="login-link">
                        Already a Member? <NavLink to={'/login'}><span>Login</span></NavLink>
                    </p>
                </Box>
            </Box>
        );
    }
}

export default Signup;
