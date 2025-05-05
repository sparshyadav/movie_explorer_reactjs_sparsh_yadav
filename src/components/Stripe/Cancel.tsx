import React from 'react';
   import { Typography, Container } from '@mui/material';
   import { Link } from 'react-router-dom';

   const Cancel: React.FC = () => {
       return (
           <Container style={{ textAlign: 'center', padding: '50px 0' }}>
               <Typography variant="h4" gutterBottom>
                   Payment Cancelled
               </Typography>
               <Typography variant="body1" gutterBottom>
                   Your payment was cancelled. Please try again to subscribe.
               </Typography>
               <Link to="/subscribe" style={{ textDecoration: 'none' }}>
                   <Typography variant="body1" color="primary">
                       Try Again
                   </Typography>
               </Link>
           </Container>
       );
   };

   export default Cancel;