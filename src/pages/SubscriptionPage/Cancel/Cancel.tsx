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
  const [cancellationDetails, setCancellationDetails] = useState<CancellationDetails | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyCancellation = async () => {
      try {
        const response = await verifyCancellationStatusAPI();

        setCancellationDetails(response || null);
        setLoading(false);
      } catch (err: any) {
        console.error('Error verifying cancellation:', err);
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