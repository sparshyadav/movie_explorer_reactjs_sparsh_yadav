import { Component } from 'react';
import './Home.scss';
import MainCarousal from '../../components/MainCarousal/MainCarousal';
import WhatToWatch from '../../components/WhatToWatch/WhatToWatch';
import StreamingPlatform from '../../components/StreamingPlatform/StreamingPlatform';
import BornToday from '../../components/BornToday/BornToday';
import Box from '@mui/material/Box';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import Watchlist from '../../components/Watchlist/Watchlist';

class Home extends Component {
  render() {
    const authToken = Cookies.get('authToken');
    if (!authToken) {
      toast.error("Please Login First, Before Accessing Movies");
    }
    return (
      <Box>
        <MainCarousal />
        <WhatToWatch />
        <StreamingPlatform />
        {localStorage.getItem('role')!=='supervisor' && Cookies.get("authToken") && <Watchlist />}
        <BornToday />
      </Box>
    );
  }
}

export default Home;
