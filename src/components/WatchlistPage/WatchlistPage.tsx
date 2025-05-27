import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import './WatchlistPage.scss';
import { getWatchlist } from '../../API';
import MovieCard from '../MovieCard/MovieCard';
import CircularProgress from '@mui/material/CircularProgress';

interface Movie {
    id: string;
    title: string;
    rating: number;
    poster_url: string;
    release_date: string;
    premium: boolean;
}

const WatchlistPage
    : React.FC = () => {
        const [movies, setMovies] = useState<Movie[]>([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchMovies = async () => {
                try {
                    setLoading(true);
                    let response;
                    response = await getWatchlist();
                    setMovies(response);

                } catch (error) {
                    console.error(`Error fetching watchlisted movies`, error);
                } finally {
                    setLoading(false);
                }
            };

            fetchMovies();
        }, []);


        useEffect(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }, []);

        return (
            <Box className="movie-page">
                <Typography variant="h3" className="page-title">
                    Your Watchlisted Movies
                </Typography>

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
            </Box>
        );
    };

export default WatchlistPage;
