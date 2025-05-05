import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Replace with your publishable key
const stripePromise = loadStripe('pk_test_51RLMBhI8TMsg84IIxvXPopZCBmDkUO20fAdCirw2DNvUt1jQAMOthJd2EjPjbg3qD62Zp8vnZYsr2j2dFx9SndGc009ItOLYgQ');

interface StripeProviderProps {
    children: React.ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
    return (
        <Elements stripe={stripePromise}>
            {children}
        </Elements>
    );
};

export default StripeProvider;