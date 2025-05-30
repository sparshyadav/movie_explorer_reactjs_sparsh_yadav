import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Box from '@mui/material/Box';
import './Signup.scss';
import { NavLink } from 'react-router-dom';
import { signupAPI } from '../../API';
import toast from 'react-hot-toast';
import NavigateWrapper from '../../components/NavigateWrapper';

type State = {
    showPassword: boolean;
    showConfirmPassword: boolean;
    isLoading: boolean;
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

type Props = {
    navigate: (path: string) => void;
};

class Signup extends React.Component<Props> {
    state: State = {
        showPassword: false,
        showConfirmPassword: false,
        isLoading: false,
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
        this.state.errors = {};

        this.state.isLoading = false;

        this.setState((prevState: State) => ({
            formFields: {
                ...prevState.formFields,
                [name]: value,
            },
        }));
    };

    handleSubmit = async () => {
        const { email, username, phoneNumber, password, confirmPassword } = this.state.formFields;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^_-])[A-Za-z\d@$!%*?#&^_-]{8,}$/;
        const phoneNumberRegex = /^[7-9][0-9]{9}$/;

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

        if (!username) {
            errors.usernameError = 'Username is required';
            isValid = false;
        }

        if (!phoneNumber) {
            errors.phoneNumberError = 'Phone Number is required';
            isValid = false;
        }
        else if (!phoneNumberRegex.test(phoneNumber)) {
            errors.phoneNumberError = 'Enter a valid phone number'
            isValid = false;
        }

        if (!password) {
            errors.passwordError = 'Password is required';
            isValid = false;
        }
        else if (!passwordRegex.test(password)) {
            errors.passwordError = 'Password must contain 8 characters, a number, a special character, an uppercase and a lowercase letter';
            isValid = false;
        }

        if (!confirmPassword) {
            errors.confirmPasswordError = 'Confirm password is required';
            isValid = false;
        }
        else if (password !== confirmPassword) {
            errors.confirmPasswordError = 'Passwords do not match';
            isValid = false;
        }

        this.setState({ errors });

        if (isValid) {
            this.setState({ isLoading: true });
            const response = await signupAPI({ name: username, email, password, mobile_number: phoneNumber });

            if (response?.status === 201) {
                toast.success("Sign Up Successfull");

                this.props.navigate('/login')
            }

            this.setState({ isLoading: false });
        }
    };

    render() {
        const { showPassword, showConfirmPassword, formFields, errors } = this.state;

        return (
            <Box className="signup-container">
                <Box className='login-title-binge'>BINGE</Box>
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

                    <Box className='password-container'>
                        <Box className="password-group">
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

                        </Box>
                        {errors.confirmPasswordError && (
                            <p className="error">{errors.confirmPasswordError}</p>
                        )}
                    </Box>
                    <button
                        className={`signup-btn ${this.state.isLoading ? 'loading' : ''}`}
                        onClick={this.handleSubmit}
                        disabled={this.state.isLoading}
                    >
                        {this.state.isLoading ? (
                            <span className="loader">Signing Up...</span>
                        ) : (
                            'Create an Account'
                        )}
                    </button>

                    <p className="login-link">
                        Already a Member? <NavLink to={'/login'}><span>Login</span></NavLink>
                    </p>
                </Box>
            </Box>
        );
    }
}

export default NavigateWrapper(Signup);
