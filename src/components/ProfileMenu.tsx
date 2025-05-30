import React from 'react';
import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import { Clapperboard, CircleUserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signoutAPI } from '../API';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

type Props = {
  role: 'admin' | 'user';
};

const ProfileMenu: React.FC<Props> = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isLoggedIn = !!Cookies.get('authToken');

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    localStorage.clear();
    Cookies.remove('authToken');
    signoutAPI();
    navigate('/login');
  };

  const handleProfile = () => {
    const token=Cookies.get('authToken');
    if(!token){
      toast.error("Please Login First");
      navigate('/login');
      return;
    }

    handleClose();
    navigate('/profile');
  };

  const handleCreateMovie = () => {
    handleClose();
    navigate('/create-movie');
  };

  const handleCreateCeleb = () => {
    handleClose();
    navigate('/create-celeb')
  }

  const handleLogin = () => {
    navigate('/login');
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#F5C518', color: 'white' }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              minWidth: 180,
              padding: '10px 0',
              fontSize: '1rem',
              color: '#F5C518',
              bgcolor: '#1a1a1a',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                bgcolor: '#1a1a1a',
                right: 14,
                width: 10,
                height: 10,
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfile}>
          <Avatar style={{ color: 'white' }} /> Profile
        </MenuItem>

        {role === 'supervisor' && (
          <MenuItem onClick={handleCreateMovie}>
            <ListItemIcon>
              <Clapperboard style={{ color: 'white' }} />
            </ListItemIcon>
            Create Movie
          </MenuItem>
        )}

        {role === 'supervisor' && (
          <MenuItem onClick={handleCreateCeleb}>
            <ListItemIcon>
              <CircleUserRound style={{ color: 'white' }} />
            </ListItemIcon>
            Create Celebrity
          </MenuItem>
        )}

        {isLoggedIn ? (
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" style={{ color: 'white' }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        ) : (
          <MenuItem onClick={handleLogin}>
            <ListItemIcon>
              <Logout fontSize="small" style={{ color: 'white' }} />
            </ListItemIcon>
            Login
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ProfileMenu;
