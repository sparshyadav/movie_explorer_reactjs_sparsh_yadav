import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './Subscription.scss';
import { createSubscription } from '../../API'; 

interface Plan {
  title: string;
  price: string;
  features: string[];
  buttonText: string;
  variant: 'starter' | 'monthly' | 'yearly';
  id: string; // Add this to map to backend subscription IDs
}

const plans: Plan[] = [
  {
    id: '1_day',
    title: '1 Day Premium',
    price: '$1.99',
    features: [
      'Full access to all movies',
      'Unlimited streaming',
      'HD quality',
      'No ads',
    ],
    buttonText: 'Get started',
    variant: 'starter',
  },
  {
    id: '1_months',
    title: '7 Day Premium',
    price: '$7.99',
    features: [
      'Full access to all movies',
      'Unlimited streaming',
      'HD & 4K quality',
      'No ads',
      'Offline downloads',
    ],
    buttonText: 'Get started',
    variant: 'monthly',
  },
  {
    id: '3_months',
    title: '1 Month Premium',
    price: '$19.99',
    features: [
      'Full access to all movies',
      'Unlimited streaming',
      'HD & 4K quality',
      'No ads',
      'Offline downloads',
      'Priority customer support',
      'Early access to new releases',
    ],
    buttonText: 'Get started',
    variant: 'yearly',
  },
];

const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError('Please select a plan.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const checkoutUrl = await createSubscription(selectedPlan);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('No checkout URL returned from server.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate subscription.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <Box className="subscription-page success-state">
        <Container maxWidth="sm">
          <Box className="success-card">
            <CheckCircleIcon color="success" sx={{ fontSize: 64 }} />
            <Typography variant="h4">Subscription Activated!</Typography>
            <Typography>
              Your {plans.find(p => p.id === selectedPlan)?.title} plan has been activated.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/home')}>
              Start Exploring
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="subscription-page">
      <Container maxWidth="lg">
        <Box className="subscription-header">
          <Typography variant="h2" className="main-title">
            Pay once, enjoy forever!
          </Typography>
          <Typography variant="subtitle1" className="subtitle">
            No recurring fees. Pay once and unlock a lifetime of usage
          </Typography>
        </Box>

        <Box className="plans-container">
          {plans.map((plan, index) => (
            <Box
              key={index}
              className={`plan-card ${plan.variant} ${selectedPlan === plan.id ? 'selected' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <Box className="plan-details">
                <Typography variant="h4" className="plan-title">
                  {plan.title}
                </Typography>
                <Typography variant="h3" className="plan-price">
                  {plan.price}
                </Typography>
                <List className="features-list">
                  {plan.features.map((feature, i) => (
                    <ListItem key={i} className="feature-item">
                      <ListItemIcon className="feature-icon">
                        <CheckIcon />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>

              </Box>
              <Button variant="contained" className="plan-button" onClick={handleSubscribe}>
                {selectedPlan === plan.id ? 'Selected' : plan.buttonText}
              </Button>
            </Box>
          ))}
        </Box>

        {/* {selectedPlan && (
          <Box className="confirm-section">
            <Typography variant="h5" gutterBottom>
              Confirm Your Subscription
            </Typography>
            <Typography>
              You selected the {plans.find(p => p.id === selectedPlan)?.title} plan.
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <Button
              variant="contained"
              disabled={isProcessing}
              onClick={handleSubscribe}
            >
              {isProcessing ? <CircularProgress size={20} /> : 'Subscribe Now'}
            </Button>
          </Box>
        )} */}

        <Box className="footer-section">
          <Typography variant="subtitle2" className="partners-label">
            In great company
          </Typography>
          <Typography variant="h6" className="partners-description">
            Our platform is the go-to movie service for successful and renowned brands
          </Typography>
          <Box className="partners-list">
            <Typography className="partner">Shopify</Typography>
            <Typography className="partner">Stripe</Typography>
            <Typography className="partner">Cash App</Typography>
            <Typography className="partner">Verizon</Typography>
          </Box>
          <Box className="back-button-container">
            <Button onClick={() => navigate("/")} startIcon={<ArrowBackIcon />}>
              Back to Home
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Subscription;
