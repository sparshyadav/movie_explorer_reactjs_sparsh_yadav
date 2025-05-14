import './Footer.scss';
import { Container, Box, Typography } from '@mui/material';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import QRCode from '../../assets/QRCode.avif';

function Footer() {
    return (
        <footer className="footer-container">
            <Container maxWidth={false} className="footer-content">
                <Box className="social-section">
                    <Box className="social-links-container">
                        <Typography variant="h6" className="section-title">Follow CriticPoint on social</Typography>
                        <Box className="social-icons">
                            <a href="#" aria-label="TikTok"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 01-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 013.183-4.51v-3.5a6.329 6.329 0 00-5.394 10.692 6.33 6.33 0 10.282-8.686 6.33 6.33 0 005.634 9.686 6.454 6.454 0 006.344-6.331v-3.358c1.355.779 2.913 1.18 4.446 1.178h.099v-3.458a4.794 4.794 0 01-2.178-.547z" fill="currentColor" />
                            </svg></a>
                            <a href="#" aria-label="Instagram"><Instagram /></a>
                            <a href="#" aria-label="Twitter"><Twitter /></a>
                            <a href="#" aria-label="YouTube"><Youtube /></a>
                            <a href="#" aria-label="Facebook"><Facebook /></a>
                        </Box>
                    </Box>

                    <Box className="app-download-container">
                        <Box>
                            <Typography variant="h6" className="section-title">Get the CriticPoint app</Typography>
                            <Typography variant="body2" className="subtitle">For Android and iOS</Typography>
                        </Box>
                        <Box className="qr-code">
                            <img src={QRCode} alt="QR Code for CriticPoint app" />
                        </Box>
                    </Box>
                </Box>

                <Box className="links-section">
                    <Box className="main-links">
                        <a href="#" className="link-with-icon">Help <span className="external-icon">↗</span></a>
                        <a href="#" className="link-with-icon">Site Index <span className="external-icon">↗</span></a>
                        <a href="#" className="link-with-icon">CriticPointPro <span className="external-icon">↗</span></a>
                        <a href="#" className="link-with-icon">Box Office Mojo <span className="external-icon">↗</span></a>
                        <a href="#" className="link-with-icon">License CriticPoint Data <span className="external-icon">↗</span></a>
                    </Box>

                    <Box className="secondary-links">
                        <a href="#">Press Room</a>
                        <a href="#" className="link-with-icon">Advertising <span className="external-icon">↗</span></a>
                        <a href="#" className="link-with-icon">Jobs <span className="external-icon">↗</span></a>
                        <a href="#">Conditions of Use</a>
                        <a href="#">Privacy Policy</a>
                    </Box>
                </Box>

                <Box className="company-info">
                    <Typography variant="body2" className="copyright">
                        © 1990-2025 by CriticPoint.com, Inc.
                    </Typography>
                </Box>
            </Container>
        </footer>
    );
}

export default Footer;