import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CloseCircleIcon from '../Cancel/CircleCloseIcon';
import './Cancel.scss';
import { verifyCancellationStatusAPI } from '../../../API';

interface CancellationDetails {
  plan_name?: string;
  end_date?: string;
  [key: string]: any;
}

const Cancel: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellationDetails, setCancellationDetails] = useState<CancellationDetails | null>(null);
  const location = useLocation();
  const navigate=useNavigate();

  useEffect(() => {
    const verifyCancellation = async () => {
      const params = new URLSearchParams(location.search);
      const subscriptionId = params.get('subscription_id');

      if (!subscriptionId) {
        setError('No subscription ID found in the URL.');
        setLoading(false);
        return;
      }

      try {
        const response = await verifyCancellationStatusAPI(subscriptionId);
        console.log("RESULT OF API IN CANCEL PAGE: ", response);

        setCancellationDetails(response);
        setLoading(false);
      } catch (err: any) {
        console.error('Error verifying cancellation:', err);
        setError(
          err.response?.data?.error || 'Failed to verify cancellation. Please try again.'
        );
        setLoading(false);
      }
    };

    verifyCancellation();
  }, [location.search]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="cancel-page">
      <div className="cancel-container">
        <div className="cancel-card">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <h2 className="title">Verifying your cancellation...</h2>
            </div>
          ) : error ? (
            <div className="error-state">
              <h2 className="title">Cancellation Error</h2>
              <p className="error-message">{error}</p>
              <button
                onClick={() => navigate('/subscribe')}
                className="action-button"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="cancel-state">
              <div className="icon-container">
                <CloseCircleIcon className="close-icon" />
              </div>
              <h2 className="title">Subscription Cancelled</h2>
              <p className="description">
                Your {cancellationDetails?.plan_name} subscription has been successfully cancelled.
                {cancellationDetails?.end_date && (
                  <span className="end-date">
                    {' '}Your access will remain active until <strong>{formatDate(cancellationDetails.end_date)}</strong>.
                  </span>
                )}
              </p>
              <div className="action-buttons">
                <button
                  onClick={() => navigate('/subscribe')}
                  className="secondary-button"
                >
                  Manage Subscription
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="action-button"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cancel;