import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import './MoviePageList.scss';
import { getEveryMovieAPI, getMoviesByGenre } from '../../API';
import MovieCard from '../MovieCard/MovieCard';

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
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getEveryMovieAPI();
                setMovies(response || []);
            } catch (error) {
                console.error("Error fetching initial movies:", error);
                setMovies([]);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleGenreMovieFetch = async (genre: string) => {
        try {
            setLoading(true);
            if (genre === 'All Movies') {
                const response = await getEveryMovieAPI();
                setMovies(response || []);
            }
            else {
                const response = await getMoviesByGenre(genre);

                setMovies(response || []);
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box className="movie-page">
            <Typography variant="h3" className="page-title">
                What to Watch - IMDb
            </Typography>

            <Box className="categories-container">
                {genres.map((category) => (
                    <Button
                        key={category}
                        className={`category-button ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => {
                            setActiveCategory(category);
                            handleGenreMovieFetch(category);
                        }}
                    >
                        {category}
                    </Button>
                ))}
            </Box>

            <Box className="movies-container">
                {loading ? (
                    <Box className="loading">
                        <Typography variant="h5">Loading...</Typography>
                    </Box>
                ) : movies?.length === undefined ? (
                    <Box className="no-movies">
                        <Typography variant="h5">
                            No Movies Found
                        </Typography>
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


        </Box>
    );
};

export default MoviePageList;