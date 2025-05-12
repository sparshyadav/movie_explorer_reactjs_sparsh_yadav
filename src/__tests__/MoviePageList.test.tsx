import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MoviePageList from '../components/MoviePageList/MoviePageList';
import { MemoryRouter } from 'react-router-dom';
import * as router from 'react-router-dom';
import { getAllMoviesAPI, getMoviesByGenre } from '../API';
import MovieCard from '../components/MovieCard/MovieCard';
import '@testing-library/jest-dom';

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

const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

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
            expect(getAllMoviesAPI).toHaveBeenCalledTimes(1);
            expect(consoleLogSpy).toHaveBeenCalledWith('RESPONSE BY GENRE: ', mockResponse);
            expect(mockSetSearchParams).toHaveBeenCalledWith({ page: '1' });
        });
    });
});