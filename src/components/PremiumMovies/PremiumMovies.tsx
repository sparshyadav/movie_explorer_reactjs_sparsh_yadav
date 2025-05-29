import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Pagination } from '@mui/material';
import './PremiumMovies.scss';
import { getEveryMovieAPI } from '../../API';
import MovieCard from '../MovieCard/MovieCard';
import { useSearchParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

interface Movie {
    id: string;
    title: string;
    rating: number;
    poster_url: string;
    release_date: string;
    premium: boolean;
    genre: string;
}

const PremiumMovies: React.FC = () => {
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [activeCategory, setActiveCategory] = useState('All Movies');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const MOVIES_PER_PAGE = 12;

    const genres = [
        'All Movies',
        'Action',
        'Comedy',
        'Drama',
        'Horror',
        'Romance',
        'Thriller',
        'Si-Fi',
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



    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                let response;
                let filteredMovies: Movie[] = [];
        
                if (activeCategory === 'All Movies') {
                    response = await getEveryMovieAPI();
                    console.log("RESPONSE OF ALL MOVIES: ", response);
                    setAllMovies(response);
                    filteredMovies = response.filter((mov: Movie) => mov.premium === true);
                } else {
                    filteredMovies = allMovies.filter(
                        (mov: Movie) => mov.premium === true && mov.genre === activeCategory
                    );
                }
        
                setTotalPages(Math.ceil(filteredMovies.length / MOVIES_PER_PAGE));
        
                const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
                const endIndex = startIndex + MOVIES_PER_PAGE;
                setMovies(filteredMovies.slice(startIndex, endIndex));
            } catch (error) {
                console.error(`Error fetching movies for genre ${activeCategory}, page ${currentPage}:`, error);
                setMovies([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };
        
        fetchMovies();
    }, [activeCategory, currentPage]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage, activeCategory]);

    const handleGenreChange = async (genre: string) => {
        setActiveCategory(genre);
        setCurrentPage(1);
    }

    return (
        <Box className="movie-page">
            <Typography variant="h3" className="page-title">
                All Premium Movies
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

export default PremiumMovies;
