import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer/Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders social section title', () => {
    expect(screen.getByText(/Follow IMDb on social/i)).toBeInTheDocument();
  });

  it('renders all social icons with correct aria-labels', () => {
    const socialLabels = ['TikTok', 'Instagram', 'Twitter', 'YouTube', 'Facebook'];
    socialLabels.forEach(label => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('renders app download section with QR code', () => {
    expect(screen.getByText(/Get the IMDb app/i)).toBeInTheDocument();
    expect(screen.getByText(/For Android and iOS/i)).toBeInTheDocument();
    expect(screen.getByAltText(/QR Code for IMDb app/i)).toBeInTheDocument();
  });

  it('renders main links with external icon', () => {
    const mainLinks = [
      /Help/i,
      /Site Index/i,
      /IMDbPro/i,
      /Box Office Mojo/i,
      /License IMDb Data/i,
    ];
    mainLinks.forEach(link => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('renders secondary links', () => {
    const secondaryLinks = [
      /Press Room/i,
      /Advertising/i,
      /Jobs/i,
      /Conditions of Use/i,
      /Privacy Policy/i,
    ];
    secondaryLinks.forEach(link => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('renders copyright', () => {
    expect(screen.getByText(/© 1990-2025 by IMDb\.com, Inc\./i)).toBeInTheDocument();
  });
});
