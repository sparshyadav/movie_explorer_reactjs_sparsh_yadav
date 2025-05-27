import './Navbar.scss';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Search, CreditCard } from 'lucide-react';
import ProfileMenu from '../ProfileMenu';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Crown, AlignJustify } from 'lucide-react';
import Cookies from 'js-cookie';
import { getSubscriptionStatus } from '../../API';
import Tooltip from '@mui/material/Tooltip';

function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
    const navigate = useNavigate();
    const [userPlan, setUserPlan] = useState<string>('');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const getUserPlan = async () => {
            const token = Cookies.get('authToken');
            if (!token) return;
            const subResult = await getSubscriptionStatus(token);
            localStorage.setItem('userPlan', subResult.plan_type);
            setUserPlan(subResult.plan_type);
        };

        getUserPlan();
    }, []);

    const handleSearch = () => {
        navigate('/search');
    }

    const handleSubscription = () => {
        navigate('/subscribe')
    }

    const handlePremium = () => {
        navigate('/premium-movies');
    }

    return (
        <Container maxWidth={false} disableGutters className="navbar-container">
            <Box className='navbar-center-container' >
                <Box className='hamburger-container'>
                    <AlignJustify className='search-icon hamburger-icon' onClick={onMenuClick}/>
                </Box>
                <Box className='right-container'>
                    <NavLink to={'/'}>
                        <Box className='navbar-icon'>
                            <Typography variant="h4" fontWeight="bold" className='site-title'>
                                BINGE
                            </Typography>
                        </Box>
                    </NavLink>
                    <Box className='navbar-options'>
                        {userPlan === 'premium' && <Tooltip title="Premium Movies"><Crown className='search-icon icon-group' onClick={handlePremium} /></Tooltip>}
                        <Tooltip title="Search"><Search className='search-icon icon-group' onClick={handleSearch} /></Tooltip>
                        {role !== 'supervisor' && <Tooltip title="Subscription"><CreditCard className='search-icon icon-group' onClick={handleSubscription} /></Tooltip>}
                        <ProfileMenu role='admin' />
                    </Box>
                </Box>
            </Box>
        </Container >
    )
}

export default Navbar