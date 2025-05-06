import { Component } from 'react';
import './Home.scss';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import MainCarousal from '../../components/MainCarousal/MainCarousal';
import WhatToWatch from '../../components/WhatToWatch/WhatToWatch';
import StreamingPlatform from '../../components/StreamingPlatform/StreamingPlatform';
import BornToday from '../../components/BornToday/BornToday';
import Box from '@mui/material/Box';

class Home extends Component {
  render() {
    return (
      <Box>
        <Navbar />
        <MainCarousal />
        <WhatToWatch />
        <StreamingPlatform />
        <BornToday />
        <Footer />
      </Box>
    );
  }
}

export default Home;
