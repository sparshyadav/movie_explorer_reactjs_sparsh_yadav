import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PremiumMovies from '../components/PremiumMovies/PremiumMovies'; // adjust path if needed
import * as API from '../API'; // adjust path if needed
import { BrowserRouter } from 'react-router-dom';

// Mock API
jest.mock('../API', () => ({
  getEveryMovieAPI: jest.fn(),
}));

// Utility render wrapper
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

// Sample mock movie data
// const mockMovies = Array.from({ length: 15 }, (_, i) => ({
//   id: `movie-${i}`,
//   title: `Movie ${i}`,
//   rating: 4.5,
//   poster_url: `url-${i}`,
//   release_date: '2025-01-01',
//   premium: true,
//   genre: i % 2 === 0 ? 'Action' : 'Comedy',
// }));

const mockMovies = Array.from({ length: 20 }, (_, i) => ({
    id: `movie-${i}`,
    title: `Movie ${i}`,
    rating: 4.5,
    poster_url: `url-${i}`,
    release_date: '2025-01-01',
    premium: true,
    genre: i % 2 === 0 ? 'Action' : 'Comedy',
  }));
  

describe('PremiumMovies Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading spinner initially', async () => {
    (API.getEveryMovieAPI as jest.Mock).mockResolvedValue({ movies: mockMovies });
    renderWithRouter(<PremiumMovies />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  });

  test('displays "No Movies Found" if no premium movies exist', async () => {
    (API.getEveryMovieAPI as jest.Mock).mockResolvedValue({
      movies: mockMovies.map((m) => ({ ...m, premium: false })),
    });

    renderWithRouter(<PremiumMovies />);
    await waitFor(() => {
      expect(screen.getByText(/no movies found/i)).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    (API.getEveryMovieAPI as jest.Mock).mockRejectedValue(new Error('API error'));

    renderWithRouter(<PremiumMovies />);
    await waitFor(() => {
      expect(screen.getByText(/no movies found/i)).toBeInTheDocument();
    });
  });
});
