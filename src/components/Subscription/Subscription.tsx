import React, { useEffect, useState } from 'react';
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
  Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import './Subscription.scss';
import { createSubscription } from '../../API';

interface Plan {
  title: string;
  price: string;
  features: string[];
  buttonText: string;
  variant: 'starter' | 'monthly' | 'yearly';
  id: string;
}

const plans: Plan[] = [
  {
    id: '1_day',
    title: '1 Day Premium',
    price: '$2.66',
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
    id: '7_days',
    title: '7 Day Premium',
    price: '$15.95',
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
    id: '1_month',
    title: '1 Month Premium',
    price: '$66.44',
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
const [isPremium, setIsPremium] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (localStorage.getItem('userPlan') === 'premium') {
      setIsPremium(true);
    }
  }, []);


  const handleSubscribe = async (selectedPlan: string) => {
    if (!selectedPlan) {
      console.log("NOT SELECTED PLAN");
      return;
    }
    try {
      console.log("I am inside the try part of the code");
      const checkoutUrl = await createSubscription(selectedPlan);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('No checkout URL returned from server.');
      }
    } catch (err: any) { }
  };

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
              className={`plan-card ${plan.variant}`}
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
              <Tooltip title={isPremium ? 'You already have premium access' : ''}>
                <span>
                  <Button
                    variant="contained"
                    className="plan-button"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isPremium}
                  >
                    {isPremium ? 'Already Subscribed' : plan.buttonText}
                  </Button>
                </span>
              </Tooltip>

            </Box>
          ))}
        </Box>

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
      </Container >
    </Box >
  );
};

export default Subscription;
