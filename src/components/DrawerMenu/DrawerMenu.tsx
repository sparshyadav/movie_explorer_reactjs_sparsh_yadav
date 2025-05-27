import { Drawer, Box, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { Film, Tv, Bookmark, Search, CreditCard, User } from 'lucide-react';
import './DrawerMenu.scss';

const DrawerMenu = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const menuItems = [
        { icon: <Film />, label: 'All Movies', path: '/all-movies' },
        { icon: <Tv />, label: 'Movies by Platform', path: '/platforms' },
        { icon: <Bookmark />, label: 'Watchlist', path: '/watchlist' },
        { icon: <Search />, label: 'Search', path: '/search' },
        { icon: <CreditCard />, label: 'Subscriptions', path: '/subscribe' },
    ];

    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <Box className="drawer-container" role="presentation">
                <Box className="drawer-header">
                    <Typography variant="h5" className="drawer-title">
                        BINGE
                    </Typography>
                </Box>

                <Box className="drawer-content">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className="drawer-menu-item"
                            onClick={onClose}
                        >
                            <Box className="menu-item-icon">
                                {item.icon}
                            </Box>
                            <Typography className="menu-item-text">
                                {item.label}
                            </Typography>
                        </NavLink>
                    ))}
                </Box>

                <Box className="drawer-footer">
                    <NavLink to="/profile" className="drawer-profile-item" onClick={onClose}>
                        <Box className="profile-icon">
                            <User />
                        </Box>
                        <Typography className="profile-text">
                            Profile
                        </Typography>
                    </NavLink>
                </Box>
            </Box>
        </Drawer>
    );
};

export default DrawerMenu;