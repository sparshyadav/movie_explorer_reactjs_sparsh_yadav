import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Pagination } from '@mui/material';
import './MoviePageList.scss';
import { getAllMoviesAPI, getMoviesByGenre } from '../../API';
import MovieCard from '../MovieCard/MovieCard';
import { useSearchParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { FormControl, Select, MenuItem } from '@mui/material';

interface Movie {
    id: string;
    title: string;
    rating: number;
    poster_url: string;
    release_date: string;
    premium: boolean;
}

const MoviePageList: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [activeCategory, setActiveCategory] = useState('All Movies');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortOption, setSortOption] = useState<string>('relevance');

    const sortOptions = [
        { value: 'relevance', label: 'Relevance' },
        { value: 'rating-high', label: 'Rating: Highest to Lowest' },
        { value: 'rating-low', label: 'Rating: Lowest to Highest' },
        { value: 'release-latest', label: 'Release: Latest to Oldest' },
        { value: 'release-oldest', label: 'Release: Oldest to Latest' },
    ];

    const genres = [
        'All Movies',
        'Action',
        'Comedy',
        'Drama',
        'Horror',
        'Romance',
        'Thriller',
        'Sci-Fi',
        'Adventure',
        'Animation'
    ];

    useEffect(() => {
        const pageParam = parseInt(searchParams.get('page') || '1', 10);
        setCurrentPage(pageParam);
    }, []);


    useEffect(() => {
        setSearchParams({ page: currentPage.toString() });
    }, [currentPage]);

    // useEffect(() => {
    //     const fetchMovies = async () => {
    //         try {
    //             setLoading(true);
    //             let response;

    //             if (activeCategory === 'All Movies') {
    //                 response = await getAllMoviesAPI(currentPage);
    //                 setMovies(response.movies);
    //             } else {
    //                 response = await getMoviesByGenre(activeCategory, currentPage);
    //                 setMovies(response.movies);
    //             }

    //             setTotalPages(response?.pagination?.total_pages || 1);
    //         } catch (error) {
    //             console.error(`Error fetching movies for genre ${activeCategory}, page ${currentPage}:`, error);
    //             setMovies([]);
    //             setTotalPages(1);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchMovies();
    // }, [activeCategory, currentPage]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                let response;

                if (activeCategory === 'All Movies') {
                    response = await getAllMoviesAPI(currentPage);
                } else {
                    response = await getMoviesByGenre(activeCategory, currentPage);
                }

                // Sort movies based on sortOption
                let sortedMovies = [...response.movies];
                if (sortOption === 'rating-high') {
                    sortedMovies.sort((a, b) => b.rating - a.rating);
                } else if (sortOption === 'rating-low') {
                    sortedMovies.sort((a, b) => a.rating - a.rating);
                } else if (sortOption === 'release-latest') {
                    sortedMovies.sort((a, b) =>
                        new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
                } else if (sortOption === 'release-oldest') {
                    sortedMovies.sort((a, b) =>
                        new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
                }

                setMovies(sortedMovies);
                setTotalPages(response?.pagination?.total_pages || 1);
            } catch (error) {
                console.error(`Error fetching movies for genre ${activeCategory}, page ${currentPage}:`, error);
                setMovies([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [activeCategory, currentPage, sortOption]);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [currentPage, activeCategory]);

    const handleGenreChange = async (genre: string) => {
        setActiveCategory(genre);
        setCurrentPage(1);
    }

    return (
        <Box className="movie-page">
            <Typography variant="h3" className="page-title">
                What to Watch
            </Typography>

            <Box className="categories-container">
                {genres.map((category) => (
                    <Button
                        key={category}
                        className={`category-button ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => handleGenreChange(category)}
                    >
                        {category}
                    </Button>
                ))}

                <Box className="sort-container">
                    <FormControl sx={{ minWidth: 150 }}>
                        <Select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="sort-select"
                            displayEmpty
                            inputProps={{ 'aria-label': 'Sort by' }}
                        >
                            {sortOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Box className="movies-container">
                {loading ? (
                    <Box className="loading">
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>
                    </Box>
                ) : movies.length === 0 ? (
                    <Box className="no-movies">
                        <Typography variant="h5">No Movies Found</Typography>
                    </Box>
                ) : (
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

export default MoviePageList;
