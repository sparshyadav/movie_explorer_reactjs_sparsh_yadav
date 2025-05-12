import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieCard from '../components/MovieCard/MovieCard';
import { MemoryRouter } from 'react-router-dom';
import * as router from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    NavLink: jest.fn(({ to, children }) => <a href={to}>{children}</a>),
}));
jest.mock('lucide-react', () => ({
    Pencil: () => <svg data-testid="pencil-icon" />,
    Crown: () => <svg data-testid="crown-icon" />,
}));
jest.mock('@mui/icons-material', () => ({
    Add: () => <svg data-testid="add-icon" />,
    Check: () => <svg data-testid="check-icon" />,
}));

const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

const scrollToSpy = jest.fn();
window.scrollTo = scrollToSpy;

const localStorageMock = (() => {
    let store: { [key: string]: string | null } = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value;
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('MovieCard Component', () => {
    const defaultProps = {
        id: '123',
        title: 'Test Movie',
        posterImage: 'test-poster.jpg',
        rating: 8.5,
        premium: false,
        onAddToWatchlist: jest.fn(),
    };

    const mockNavigate = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        (router.useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        localStorageMock.getItem.mockImplementation((key) => null); 
        scrollToSpy.mockClear();
    });

    test('renders movie card with title, poster, rating, and watchlist button', () => {
        render(
            <MemoryRouter>
                <MovieCard {...defaultProps} />
            </MemoryRouter>
        );

        expect(screen.getByText('Test Movie')).toBeInTheDocument();
        expect(screen.getByAltText('Test Movie poster')).toHaveAttribute('src', 'test-poster.jpg');
        expect(screen.getByText('8.5')).toBeInTheDocument();
        expect(screen.getByText('Add to Watchlist')).toBeInTheDocument();
        expect(screen.getByTestId('add-icon')).toBeInTheDocument();
        expect(screen.getByText('More Info')).toBeInTheDocument();
    });

    test('displays premium badge when premium is true', () => {
        render(
            <MemoryRouter>
                <MovieCard {...defaultProps} premium={true} />
            </MemoryRouter>
        );

        expect(screen.getByTestId('crown-icon')).toBeInTheDocument();
    });

    test('displays edit button for supervisor role', () => {
        localStorageMock.getItem.mockImplementation((key) => (key === 'role' ? 'supervisor' : null));

        render(
            <MemoryRouter>
                <MovieCard {...defaultProps} />
            </MemoryRouter>
        );

        const editButton = screen.getByTestId('pencil-icon').parentElement!.parentElement!;
        expect(editButton).toHaveAttribute('href', '/edit-movie/123');
        fireEvent.click(editButton.querySelector('button')!);
        expect(consoleLogSpy).toHaveBeenCalledWith('Edit 123');
    });

    test('navigates to movie details for non-premium movie', async () => {
        localStorageMock.getItem.mockImplementation((key) => (key === 'userPlan' ? 'basic' : null));

        render(
            <MemoryRouter>
                <MovieCard {...defaultProps} premium={false} />
            </MemoryRouter>
        );

        const moreInfoButton = screen.getByText('More Info');
        await userEvent.click(moreInfoButton);

        expect(mockNavigate).toHaveBeenCalledWith('/movie-details/123');
        expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    test('navigates to movie details for premium movie with premium plan', async () => {
        localStorageMock.getItem.mockImplementation((key) => (key === 'userPlan' ? 'premium' : null));

        render(
            <MemoryRouter>
                <MovieCard {...defaultProps} premium={true} />
            </MemoryRouter>
        );

        const moreInfoButton = screen.getByText('More Info');
        await userEvent.click(moreInfoButton);

        expect(mockNavigate).toHaveBeenCalledWith('/movie-details/123');
        expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    test('navigates to subscribe page for premium movie with non-premium plan', async () => {
        localStorageMock.getItem.mockImplementation((key) => (key === 'userPlan' ? 'basic' : null));

        render(
            <MemoryRouter>
                <MovieCard {...defaultProps} premium={true} />
            </MemoryRouter>
        );

        const moreInfoButton = screen.getByText('More Info');
        await userEvent.click(moreInfoButton);

        expect(mockNavigate).toHaveBeenCalledWith('/subscribe');
        expect(scrollToSpy).not.toHaveBeenCalled();
    });

    test('navigates to subscribe page for premium movie with no user plan', async () => {
        localStorageMock.getItem.mockImplementation((key) => null);

        render(
            <MemoryRouter>
                <MovieCard {...defaultProps} premium={true} />
            </MemoryRouter>
        );

        const moreInfoButton = screen.getByText('More Info');
        await userEvent.click(moreInfoButton);

        expect(mockNavigate).toHaveBeenCalledWith('/subscribe');
        expect(scrollToSpy).not.toHaveBeenCalled();
    });
});