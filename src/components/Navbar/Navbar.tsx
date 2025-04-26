import './Navbar.scss';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TextField, InputAdornment } from '@mui/material';
import { Search } from 'lucide-react';
import ProfileMenu from '../ProfileMenu';
import { useContext } from 'react';
import UserContext from '../../context/UserContext';

function Navbar() {
    const userContext = useContext(UserContext);
    const user = userContext?.user;
    console.log("USER: ", user);   
    
    return (
        <Container maxWidth={false} disableGutters className="navbar-container">
            <Box className='navbar-center-container' >
                <Box className='navbar-icon'>
                    <Typography variant="h4" fontWeight="bold">
                        IMDB
                    </Typography>
                </Box>
                <Box className='navbar-search'>
                    <TextField placeholder='Search Movies' className='search-input' InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <Search size={20} color="#888" className='search-icon' />
                            </InputAdornment>
                        ),
                        style: { height: '100%' }
                    }}>
                    <Search />
                </TextField>
            </Box>
            <Box className='navbar-options'>
                <ProfileMenu role='admin' />
            </Box>
        </Box>
        </Container >
    )
}

export default Navbar
