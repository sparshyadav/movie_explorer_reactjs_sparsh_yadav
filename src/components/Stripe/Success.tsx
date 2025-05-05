import React from 'react';
   import { Typography, Container } from '@mui/material';
   import { Link } from 'react-router-dom';

   const Success: React.FC = () => {
       return (
           <Container style={{ textAlign: 'center', padding: '50px 0' }}>
               <Typography variant="h4" gutterBottom>
                   Payment Successful!
               </Typography>
               <Typography variant="body1" gutterBottom>
                   Thank you for your subscription. You now have access to premium content.
               </Typography>
               <Link to="/" style={{ textDecoration: 'none' }}>
                   <Typography variant="body1" color="primary">
                       Return to Home
                   </Typography>
               </Link>
           </Container>
       );
   };

   export default Success;