import './Navbar.scss';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Search, CreditCard } from 'lucide-react';
import ProfileMenu from '../ProfileMenu';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Crown } from 'lucide-react';
import Cookies from 'js-cookie';
import { getSubscriptionStatus } from '../../API';

function Navbar() {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const location = useLocation();
    const [userPlan, setUserPlan] = useState<string>('');

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

    useEffect(() => {
        if (location.pathname === '/search') {
            inputRef.current?.focus();
        }
    }, [location.pathname]);


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
                <NavLink to={'/'}>
                    <Box className='navbar-icon'>
                        <Typography variant="h4" fontWeight="bold" className='site-title'>
                            BINGE
                        </Typography>
                    </Box>
                </NavLink>
                <Box className='navbar-options'>
                    {userPlan === 'premium' && <Crown className='search-icon' onClick={handlePremium} />}
                    <Search className='search-icon' onClick={handleSearch} />
                    <CreditCard className='search-icon' onClick={handleSubscription} />
                    <ProfileMenu role='admin' />
                </Box>
            </Box>
        </Container >
    )
}

export default Navbar
