import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchResultPage from '../components/SearchResultPage/SearchResultPage';
import { BrowserRouter } from 'react-router-dom';
import * as api from '../API';

jest.mock('../components/Navbar/Navbar', () => () => <div>Navbar</div>);
jest.mock('../components/Footer/Footer', () => () => <div>Footer</div>);

jest.mock('../API', () => ({
  searchMovieAPI: jest.fn(),
  getMoviesByGenre: jest.fn(),
}));

const mockMovies = [
  {
    id: '1',
    premium: false,
    title: 'Test Movie A',
    poster_url: 'posterA.jpg',
    rating: '8.1',
  },
  {
    id: '2',
    premium: true,
    title: 'Test Movie B',
    poster_url: 'posterB.jpg',
    rating: '7.4',
  },
];

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('SearchResultPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders initial layout with navbar and footer', () => {
    renderWithRouter(<SearchResultPage />);
    expect(screen.getByText('Navbar')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(screen.getByText('Search Results')).toBeInTheDocument();
  });

  test('debounces search input and fetches results', async () => {
    (api.searchMovieAPI as jest.Mock).mockResolvedValueOnce({
      movies: mockMovies,
    });

    renderWithRouter(<SearchResultPage />);
    const input = screen.getByPlaceholderText('Search anything...');
    fireEvent.change(input, { target: { value: 'Test' } });

    expect(api.searchMovieAPI).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2500);

    await waitFor(() => {
      expect(api.searchMovieAPI).toHaveBeenCalledWith(1, 'Test');
      expect(screen.getByText('Test Movie A')).toBeInTheDocument();
    });
  });

  test('filters movies by genre chip click', async () => {
    (api.getMoviesByGenre as jest.Mock).mockResolvedValueOnce({
      movies: [mockMovies[1]],
    });

    renderWithRouter(<SearchResultPage />);
    const chip = screen.getByText('Thriller');
    fireEvent.click(chip);

    await waitFor(() => {
      expect(api.getMoviesByGenre).toHaveBeenCalledWith('Thriller', 1);
      expect(screen.getByText('Test Movie B')).toBeInTheDocument();
    });
  });

  it('adds new genre via "+" chip and confirms with Enter', async () => {
    render(<SearchResultPage />);

    fireEvent.click(screen.getByText('+'));

    const allInputs = screen.getAllByDisplayValue('');
    const genreInput = allInputs[1]; 

    fireEvent.change(genreInput, { target: { value: 'Comedy' } });
    fireEvent.keyDown(genreInput, { key: 'Enter', code: 'Enter' });

    expect(await screen.findByText('Comedy')).toBeInTheDocument();
  });

  test('removes genre when "X" is clicked', async () => {
    renderWithRouter(<SearchResultPage />);

    const genreChip = screen.getByText('Drama');
    fireEvent.mouseEnter(genreChip.parentElement!);

    const xIcon = screen.getByRole('img', { hidden: true });
    fireEvent.click(xIcon);

    expect(screen.queryByText('Drama')).not.toBeInTheDocument();
  });

  test('displays result count correctly', async () => {
    (api.searchMovieAPI as jest.Mock).mockResolvedValueOnce({
      movies: mockMovies,
    });

    renderWithRouter(<SearchResultPage />);
    fireEvent.change(screen.getByPlaceholderText('Search anything...'), { target: { value: 'X' } });
    jest.advanceTimersByTime(2500);

    await waitFor(() => {
      expect(screen.getByText('Found 2 results')).toBeInTheDocument();
    });
  });
});
