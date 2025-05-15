import { Component } from 'react';
import { 
  Typography, 
  Button, 
  Box, 
  Container,
  Paper,
  ThemeProvider,
  createTheme,
  IconButton
} from '@mui/material';
import './FallbackPage.scss';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFD700', 
    },
    secondary: {
      main: '#1976d2', 
    },
    background: {
      default: '#121212', 
      paper: '#1E1E1E', 
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FFD700',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    }
  },
});

interface FallbackPageProps {
  onGoHome?: () => void;
  onSearch?: () => void;
}

interface FallbackPageState {
  countdown: number;
  animationComplete: boolean;
}

class FallbackPage extends Component<FallbackPageProps, FallbackPageState> {
  private timer: NodeJS.Timeout | null = null;
  
  constructor(props: FallbackPageProps) {
    super(props);
    this.state = {
      countdown: 10,
      animationComplete: false,
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(prevState => ({
        countdown: prevState.countdown > 0 ? prevState.countdown - 1 : 0
      }), () => {
        if (this.state.countdown === 0 && this.timer) {
          clearInterval(this.timer);
          this.setState({ animationComplete: true });
        }
      });
    }, 1000);

    setTimeout(() => {
      const element = document.querySelector('.fallback-container');
      if (element) {
        element.classList.add('loaded');
      }
    }, 100);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  handleGoHome = () => {
    if (this.props.onGoHome) {
      this.props.onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  handleSearch = () => {
    if (this.props.onSearch) {
      this.props.onSearch();
    } else {
      window.location.href = '/search';
    }
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="fallback-page">
          <Container maxWidth="lg">
            <Box className="fallback-container">
              <Paper elevation={3} className="fallback-content">
                <Box className="header-section">
                  <Typography variant="h1">404</Typography>
                  <Typography variant="h2" className="subtitle">Page Not Found</Typography>
                </Box>

                <Box className="message-section">
                  <Typography variant="body1">
                    Oops! The film reel seems to have gone missing.
                  </Typography>
                  <Typography variant="body2" className="secondary-message">
                    We couldn't find the page you were looking for. It might have been moved,
                    deleted, or perhaps it never existed in our movie database.
                  </Typography>
                </Box>

                <Box className="divider-container">
                  <div className="film-strip">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="film-cell"></div>
                    ))}
                  </div>
                </Box>

                

                <Box className="actions-section">
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={this.handleGoHome}
                    className="action-button"
                  >
                    Back to Home
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={this.handleSearch}
                    className="action-button"
                  >
                    Search Movies
                  </Button>
                </Box>
                
                <Box className="footer-section">
                  <IconButton 
                    color="primary" 
                    onClick={this.handleGoHome}
                    className="footer-icon"
                  >
                  </IconButton>
                  <Typography variant="body2" className="footer-text">
                    © {new Date().getFullYear()} Binge.co
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Container>
        </div>
      </ThemeProvider>
    );
  }
}

export default FallbackPage;