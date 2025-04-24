import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Login.scss';
import { NavLink } from 'react-router-dom';

type State = {
    showPassword: boolean;
    formFields: {
        email: string;
        password: string;
    };
    errors: {
        emailError?: string;
    };
};

class Login extends React.Component {
    state: State = {
        showPassword: false,
        formFields: {
            email: '',
            password: ''
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
        const { email, password } = this.state.formFields;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const errors: State['errors'] = {};

        if (!email) errors.emailError = 'Email is required';
        else if (!emailRegex.test(email)) errors.emailError = 'Enter a valid email';

        console.log("Password: ", password);

        this.setState({ errors });
    };

    render() {
        const { showPassword, formFields, errors } = this.state;

        return (
            <div className="login-container">
                <div className="login-card">
                    <h1 className="login-title">Login</h1>

                    <div className="form-group">
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={formFields.email}
                            onChange={this.handleChange}
                        />
                        {errors.emailError && <p className="error">{errors.emailError}</p>}
                    </div>

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

                    <button className="login-btn" onClick={this.handleSubmit}>
                        Create Account
                    </button>

                    <p className="login-link">
                        Become a Member? <NavLink to={'/signup'}><span>Login</span></NavLink>
                    </p>
                </div>
            </div>
        );
    }
}

export default Login;
