import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import './Subscription.scss';

interface PlanFeature {
  text: string;
}

interface Plan {
  title: string;
  price: string;
  features: PlanFeature[];
  buttonText: string;
  variant: 'starter' | 'monthly' | 'yearly';
}

const plans: Plan[] = [
  {
    title: 'Starter',
    price: 'Free',
    features: [
      { text: 'Trailer access across all devices' },
      { text: 'Security & browsing freedom' },
      { text: 'Limited movie access' },
      { text: '720p streaming' },
      { text: 'Ads supported' },
    ],
    buttonText: 'Get started',
    variant: 'starter',
  },
  {
    title: 'Basic',
    price: '$199',
    features: [
      { text: 'Personal account, for daily use' },
      { text: 'Unlimited access to all movies' },
      { text: 'No ads, HD content' },
      { text: '720p, 1080p & 4K streaming' },
      { text: 'Lifetime access' },
    ],
    buttonText: 'Get started',
    variant: 'monthly',
  },
  {
    title: 'Premium',
    price: '$499',
    features: [
      { text: '5 user accounts' },
      { text: 'Unlimited access across all devices' },
      { text: 'Exclusive admin & reporting features' },
      { text: '720p, 1080p & 4K streaming' },
      { text: 'Lifetime access' },
    ],
    buttonText: 'Get started',
    variant: 'yearly',
  },
];

const Subscription: React.FC = () => {
  const navigate = useNavigate();

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
                      <ListItemText primary={feature.text} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <NavLink to={'/payment'}>
                <Button
                  variant="contained"
                  className="plan-button"
                >
                  {plan.buttonText}
                </Button>
              </NavLink>
            </Box>
          ))}
        </Box>

        {/* Footer Section */}
        <Box className="footer-section">
          <Typography variant="subtitle2" className="partners-label">
            In great company
          </Typography>

          <Typography variant="h6" className="partners-description">
            Our platform is the go-to movie service for successful and renowned brands
          </Typography>

          <Box className="partners-list">
            <Typography variant="body1" className="partner">Shopify</Typography>
            <Typography variant="body1" className="partner">Stripe</Typography>
            <Typography variant="body1" className="partner">Cash App</Typography>
            <Typography variant="body1" className="partner">Verizon</Typography>
          </Box>

          <Box className="back-button-container">
            <Button
              onClick={() => navigate("/")}
              startIcon={<ArrowBackIcon />}
              className="back-button"
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Subscription;





