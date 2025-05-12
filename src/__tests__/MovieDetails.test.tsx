import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MovieDetails from '../components/MovieDetails/MovieDetails';
import { movieDetailsAPI } from '../API';
import '@testing-library/jest-dom';

jest.mock('../API', () => ({
  movieDetailsAPI: jest.fn(),
}));

jest.mock('../components/Navbar/Navbar', () => () => <div data-testid="navbar" />);
jest.mock('../components/Footer/Footer', () => () => <div data-testid="footer" />);
jest.mock('../components/WhatToWatch/WhatToWatch', () => () => <div data-testid="what-to-watch" />);
jest.mock('../components/MovieDetails/TopLineLoader/TopLineLoader', () => () => <div data-testid="loader" />);

const mockMovie = {
  title: 'Inception',
  release_year: 2010,
  duration: '148',
  rating: 8.8,
  poster_url: '/poster.jpg',
  banner_url: '/banner.jpg',
  genre: 'Sci-Fi',
  description: 'A mind-bending thriller.',
  director: 'Christopher Nolan',
  main_lead: 'Leonardo DiCaprio',
  streaming_platform: 'Netflix',
};

const renderWithRoute = (id: string) => {
  return render(
    <MemoryRouter initialEntries={[`/movies/${id}`]}>
      <Routes>
        <Route path="/movies/:id" element={<MovieDetails />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('MovieDetails Component', () => {
  beforeEach(() => {
    (movieDetailsAPI as jest.Mock).mockResolvedValue(mockMovie);
  });

  it('renders loader initially', async () => {
    renderWithRoute('1');
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    await waitFor(() => expect(movieDetailsAPI).toHaveBeenCalled());
  });

  it('renders movie details after API call', async () => {
    renderWithRoute('1');

    expect(await screen.findByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('2010')).toBeInTheDocument();
    expect(screen.getByText('148 mins')).toBeInTheDocument();
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
    expect(screen.getByText('A mind-bending thriller.')).toBeInTheDocument();
    expect(screen.getByText('Christopher Nolan')).toBeInTheDocument();
    expect(screen.getByText('Leonardo DiCaprio')).toBeInTheDocument();
    expect(screen.getByAltText(/Netflix logo/i)).toBeInTheDocument();
  });

  it('toggles watchlist button', async () => {
    renderWithRoute('1');

    const addBtn = await screen.findByRole('button', { name: /Add to Watchlist/i });
    fireEvent.click(addBtn);

    expect(screen.getByText(/In Watchlist/i)).toBeInTheDocument();

    const addedBtn = screen.getByRole('button', { name: /In Watchlist/i });
    fireEvent.click(addedBtn);

    expect(screen.getByText(/Add to Watchlist/i)).toBeInTheDocument();
  });

  it('renders navbar, footer, and WhatToWatch', async () => {
    renderWithRoute('1');

    expect(await screen.findByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('what-to-watch')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    (movieDetailsAPI as jest.Mock).mockRejectedValueOnce(new Error('API failed'));

    renderWithRoute('999');
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    await waitFor(() => expect(movieDetailsAPI).toHaveBeenCalled());
  });
});
