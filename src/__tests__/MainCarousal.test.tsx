import { render, screen, waitFor } from '@testing-library/react';
import { MainCarousal } from '../components/MainCarousal/MainCarousal';
import * as api from '../API';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('react-slick', () => (props: any) => (
  <div data-testid="mock-slider">{props.children}</div>
));

jest.mock('../components/MainCarousal/ShimmerMainCarousal', () => () => (
  <div data-testid="shimmer-loader">Loading...</div>
));

const mockMovies = [
  {
    id: '1',
    title: 'Inception',
    genre: 'Sci-Fi',
    release_year: '2010',
    rating: '8.8',
    director: 'Christopher Nolan',
    duration: '148 min',
    streaming_platform: 'Netflix',
    main_lead: 'Leonardo DiCaprio',
    description: 'A thief who steals corporate secrets through dream-sharing.',
    premium: false,
    poster_url: 'https://example.com/poster.jpg',
    banner_url: 'https://example.com/banner.jpg',
  }
];

jest.spyOn(api, 'getAllMoviesAPI').mockResolvedValue({ movies: mockMovies });

describe('MainCarousal Component', () => {
  test('renders shimmer loader initially', () => {
    render(
      <Router>
        <MainCarousal />
      </Router>
    );
    expect(screen.getByTestId('shimmer-loader')).toBeInTheDocument();
  });

  test('renders movie banner and title after loading', async () => {
    render(
      <Router>
        <MainCarousal />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
      expect(screen.getByText(/corporate secrets/i)).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/poster.jpg');
    });
  });

  test('renders banner background image via inline style', async () => {
    render(
      <Router>
        <MainCarousal />
      </Router>
    );
  
    await screen.findByText('Inception');
  
    const bannerImageDiv = document.querySelector('.banner-image') as HTMLElement;
  
    expect(bannerImageDiv).toBeInTheDocument();
    expect(bannerImageDiv.style.backgroundImage).toContain("");
  });
  

  test('resizes correctly for small screen description truncation', async () => {
    global.innerWidth = 400;
    global.dispatchEvent(new Event('resize'));

    render(
      <Router>
        <MainCarousal />
      </Router>
    );

    const description = await screen.findByText((content, node) => {
      return node?.textContent?.includes('...') && content.startsWith('A thief');
    });

    expect(description).toBeInTheDocument();
  });

  test('renders NavLink to movie-details', async () => {
    render(
      <Router>
        <MainCarousal />
      </Router>
    );

    const link = await screen.findByRole('link');
    expect(link).toHaveAttribute('href', '/movie-details/1');
  });
});
