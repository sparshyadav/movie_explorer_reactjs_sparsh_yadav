import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import CheckCircleIcon from './CheckCirlceIcon'; 
import './Success.scss';

interface SubscriptionDetails {
  plan_name?: string;
  [key: string]: any;
}

const Success: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null);
  const location = useLocation();

  useEffect(() => {
    const verifySubscription = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');

      if (!sessionId) {
        setError('No session ID found in the URL.');
        setLoading(false);
        return;
      }

      try {
        const authToken = localStorage.getItem('token');
        const response = await axios.get(
          `https://movie-explorer-ror-aalekh-2ewg.onrender.com/api/v1/subscriptions/success?session_id=${sessionId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setSubscriptionDetails(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error verifying subscription:', err);
        setError(
          err.response?.data?.error || 'Failed to verify subscription. Please try again.'
        );
        setLoading(false);
      }
    };

    verifySubscription();
  }, [location.search]);

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-card">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <h2 className="title">Verifying your subscription...</h2>
            </div>
          ) : error ? (
            <div className="error-state">
              <h2 className="title">Subscription Error</h2>
              <p className="error-message">{error}</p>
              <button 
                onClick={() => (window.location.href = '/user/subscription')}
                className="action-button"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="success-state">
              <div className="check-icon-container">
                <CheckCircleIcon className="check-icon" />
              </div>
              <h2 className="title">Subscription Activated!</h2>
              <p className="description">
                Your subscription has been successfully activated.
                {subscriptionDetails?.plan_name && (
                  <span className="plan-name"> Enjoy your {subscriptionDetails.plan_name}!</span>
                )}
              </p>
              <button
                onClick={() => (window.location.href = '/')}
                className="action-button"
              >
                Start Exploring Movies
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Success;