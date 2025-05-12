import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MoviePageList from '../components/MoviePageList/MoviePageList';
import { MemoryRouter } from 'react-router-dom';
import * as router from 'react-router-dom';
import { getAllMoviesAPI, getMoviesByGenre } from '../API';
import MovieCard from '../components/MovieCard/MovieCard';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('../API', () => ({
    getAllMoviesAPI: jest.fn(),
    getMoviesByGenre: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useSearchParams: jest.fn(),
}));
jest.mock('../components/MovieCard/MovieCard', () => jest.fn(({ id, title, posterImage, rating, premium }) => (
    <div data-testid={`movie-card-${id}`}>
        {title} - {posterImage} - {rating} - {premium ? 'Premium' : 'Free'}
    </div>
)));

// Mock console methods
const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

// Mock window.scrollTo
const scrollToSpy = jest.fn();
window.scrollTo = scrollToSpy;

describe('MoviePageList Component', () => {
    const mockMovies = [
        { id: '1', title: 'Movie 1', poster_url: 'poster1.jpg', rating: 8.0, release_date: '2023-01-01', premium: false },
        { id: '2', title: 'Movie 2', poster_url: 'poster2.jpg', rating: 7.5, release_date: '2023-02-01', premium: true },
    ];
    const mockResponse = {
        movies: mockMovies,
        pagination: { total_pages: 3 },
    };

    let mockSetSearchParams = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        (getAllMoviesAPI as jest.Mock).mockResolvedValue(mockResponse);
        (getMoviesByGenre as jest.Mock).mockResolvedValue(mockResponse);
        (router.useSearchParams as jest.Mock).mockReturnValue([
            new URLSearchParams({ page: '1' }),
            mockSetSearchParams,
        ]);
        scrollToSpy.mockClear();
        MovieCard.mockClear();
    });

    test('renders title, genre buttons, and pagination', async () => {
        render(
            <MemoryRouter>
                <MoviePageList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('What to Watch - IMDb')).toBeInTheDocument();
            expect(screen.getByText('All Movies')).toBeInTheDocument();
            expect(screen.getByText('Action')).toBeInTheDocument();
            expect(screen.getByText('Comedy')).toBeInTheDocument();
            expect(screen.getByText('Drama')).toBeInTheDocument();
            expect(screen.getByText('Horror')).toBeInTheDocument();
            expect(screen.getByText('Romance')).toBeInTheDocument();
            expect(screen.getByText('Thriller')).toBeInTheDocument();
            expect(screen.getByText('Si-Fi')).toBeInTheDocument();
            expect(screen.getByText('Adventure')).toBeInTheDocument();
            expect(screen.getByText('Animation')).toBeInTheDocument();
            expect(screen.getByTestId('movie-card-1')).toBeInTheDocument();
            expect(screen.getByTestId('movie-card-2')).toBeInTheDocument();
            expect(screen.getByRole('navigation')).toBeInTheDocument(); // Pagination
        });
    });

    test('displays loading spinner when loading', async () => {
        (getAllMoviesAPI as jest.Mock).mockImplementation(() => new Promise(() => { })); // Never resolves

        render(
            <MemoryRouter>
                <MoviePageList />
            </MemoryRouter>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByTestId('movie-card-1')).not.toBeInTheDocument();
            expect(screen.queryByText('No Movies Found')).not.toBeInTheDocument();
        });
    });

    test('displays no movies found when movies array is empty', async () => {
        (getAllMoviesAPI as jest.Mock).mockResolvedValue({ movies: [], pagination: { total_pages: 1 } });

        render(
            <MemoryRouter>
                <MoviePageList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('No Movies Found')).toBeInTheDocument();
            expect(screen.queryByTestId('movie-card-1')).not.toBeInTheDocument();
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });
    });

    test('fetches all movies when activeCategory is All Movies', async () => {
        render(
            <MemoryRouter>
                <MoviePageList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getAllMoviesAPI).toHaveBeenCalledWith(1);
            expect(getMoviesByGenre).not.toHaveBeenCalled();
            expect(MovieCard).toHaveBeenCalledTimes(2);
            expect(MovieCard).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: '1',
                    title: 'Movie 1',
                    posterImage: 'poster1.jpg',
                    rating: 8.0,
                    premium: false,
                }),
                undefined
            );
            expect(consoleLogSpy).toHaveBeenCalledWith('RESPONSE FOR ALL MOVIES: ', mockResponse);
            expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'pagination navigation');
        });
    });

    test('fetches movies by genre when activeCategory is not All Movies', async () => {
        render(
            <MemoryRouter>
                <MoviePageList />
            </MemoryRouter>
        );

        await act(async () => {
            await userEvent.click(screen.getByText('Action'));
        });

        await waitFor(() => {
            expect(getMoviesByGenre).toHaveBeenCalledWith('Action', 1);
            expect(getAllMoviesAPI).toHaveBeenCalledTimes(1); // Initial render
            expect(consoleLogSpy).toHaveBeenCalledWith('RESPONSE BY GENRE: ', mockResponse);
            expect(mockSetSearchParams).toHaveBeenCalledWith({ page: '1' });
        });
    });

    test('handles API error gracefully', async () => {
        (getAllMoviesAPI as jest.Mock).mockRejectedValue(new Error('API Error'));

        render(
            <MemoryRouter>
                <MoviePageList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching movies for genre All Movies, page 1:', expect.any(Error));
            expect(screen.getByText('No Movies Found')).toBeInTheDocument();
            expect(screen.queryByTestId('movie-card-1')).not.toBeInTheDocument();
            expect(screen.getByRole('navigation')).toBeInTheDocument();
        });
    });

    test('changes genre and resets page to 1', async () => {
        render(
            <MemoryRouter>
                <MoviePageList />
            </MemoryRouter>
        );

        await act(async () => {
            await userEvent.click(screen.getByText('Comedy'));
        });

        await waitFor(() => {
            expect(screen.getByText('Comedy')).toHaveClass('active');
            expect(screen.getByText('All Movies')).not.toHaveClass('active');
            expect(getMoviesByGenre).toHaveBeenCalledWith('Comedy', 1);
            expect(mockSetSearchParams).toHaveBeenCalledWith({ page: '1' });
            expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
        });
    });

    test('updates page and search params on pagination change', async () => {
        render(
            <MemoryRouter>
                <MoviePageList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('movie-card-1')).toBeInTheDocument();
        });

        await act(async () => {
            const page2Button = screen.getByRole('button', { name: 'Go to page 2' });
            await userEvent.click(page2Button);
        });

        await waitFor(() => {
            expect(getAllMoviesAPI).toHaveBeenCalledWith(2);
            expect(mockSetSearchParams).toHaveBeenCalledWith({ page: '2' });
            expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
        });
    });

    test('sets initial page from URL search params', async () => {
        (router.useSearchParams as jest.Mock).mockReturnValue([
            new URLSearchParams({ page: '3' }),
            mockSetSearchParams,
        ]);

        render(
            <MemoryRouter>
                <MoviePageList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getAllMoviesAPI).toHaveBeenCalledWith(3);
            expect(screen.getByRole('button', { name: 'page 3' })).toHaveClass('Mui-selected');
        });
    });

    test('handles invalid page param gracefully', async () => {
        (router.useSearchParams as jest.Mock).mockReturnValue([
            new URLSearchParams({ page: 'invalid' }),
            mockSetSearchParams,
        ]);

        render(
            <MemoryRouter>
                <MoviePageList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getAllMoviesAPI).toHaveBeenCalledWith(1); // Falls back to 1
            expect(mockSetSearchParams).toHaveBeenCalledWith({ page: '1' });
        });
    });

    test('scrolls to top on page or category change', async () => {
        render(
            <MemoryRouter>
                <MoviePageList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('movie-card-1')).toBeInTheDocument();
        });

        // Change page
        await act(async () => {
            const page2Button = screen.getByRole('button', { name: 'Go to page 2' });
            await userEvent.click(page2Button);
        });

        // Change genre
        await act(async () => {
            await userEvent.click(screen.getByText('Drama'));
        });

        await waitFor(() => {
            expect(scrollToSpy).toHaveBeenCalledTimes(3); // Initial render, page change, genre change
            expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
        });
    });
});