import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Pagination } from '@mui/material';
import './PlatformPageList.scss';
import MovieCard from '../MovieCard/MovieCard';
import { useSearchParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { getEveryMovieAPI } from '../../API';

interface Movie {
    id: string;
    title: string;
    rating: number;
    poster_url: string;
    release_date: string;
    premium: boolean;
    streaming_platform: string;
}

const PlatformPageList: React.FC = () => {
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [activePlatform, setActivePlatform] = useState('Netflix');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const platforms = ['Netflix', 'Amazon', 'HBO', 'Hulu'];

    const MOVIES_PER_PAGE = 12;

    useEffect(() => {
        const pageParam = parseInt(searchParams.get('page') || '1', 10);
        setCurrentPage(pageParam);
    }, []);

    useEffect(() => {
        setSearchParams({ page: currentPage.toString() });
    }, [currentPage]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const response = await getEveryMovieAPI();
                const moviesFromAPI = response?.movies || [];
                setAllMovies(moviesFromAPI);

                const platformMovies = moviesFromAPI.filter((m: { streaming_platform: string; }) => m.streaming_platform === 'Netflix');
                setMovies(platformMovies);
            } catch (error) {
                console.error(`Error fetching movies for platform ${activePlatform}, page ${currentPage}:`, error);
                setAllMovies([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [currentPage, activePlatform]);

    useEffect(() => {
        const platformMovies = allMovies.filter(
            (mov) => mov.streaming_platform === activePlatform
        );

        const total = Math.ceil(platformMovies.length / MOVIES_PER_PAGE);
        setTotalPages(total);

        const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
        const endIndex = startIndex + MOVIES_PER_PAGE;
        const paginatedMovies = platformMovies.slice(startIndex, endIndex);

        setMovies(paginatedMovies);
    }, [allMovies, activePlatform, currentPage]);

    const handlePlatformChange = (platform: string) => {
        setCurrentPage(1);
        setActivePlatform(platform);
    };

    return (
        <Box className="movie-page">
            <Typography variant="h3" className="page-title">
                Movies by Platform
            </Typography>

            <Box className="categories-container">
                {platforms.map((platform) => (
                    <Button
                        key={platform}
                        className={`category-button ${activePlatform === platform ? 'active' : ''}`}
                        onClick={() => handlePlatformChange(platform)}
                    >
                        {platform}
                    </Button>
                ))}
            </Box>

            <Box className="movies-container">
                {loading ? (
                    <Box className="loading">
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>
                    </Box>
                ) :
                    movies.length === 0 ? (
                        <Box className="no-movies">
                            <Typography variant="h5">No Movies Found</Typography>
                        </Box>
                    ) :
                        (
                            movies.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    premium={movie.premium}
                                    id={movie.id}
                                    title={movie.title}
                                    posterImage={movie.poster_url}
                                    rating={movie.rating}
                                />
                            ))
                        )}
            </Box>

            {!loading && (
                <Box className="pagination-container" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(_, value) => setCurrentPage(value)}
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
};

export default PlatformPageList;
