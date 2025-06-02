import { Box, Container, Typography, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import './SearchResultPage.scss';
import { getTopRatedMoviesAPI, searchMovieAPI } from '../../API';
import MovieCard from '../MovieCard/MovieCard';
import CircularProgress from '@mui/material/CircularProgress';

type Movie = {
    id: string;
    premium: boolean;
    title: string;
    poster_url: string;
    rating: string;
};

function SearchResultPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedMovies, setSearchedMovies] = useState<Movie[]>([]);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [topTrendingMovies, setTopTrendingMovies] = useState<Movie[]>([]);

    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setIsLoading(true);
        setSearchQuery(value);
    };

    useEffect(() => {
        const useFetchTopMovies = async () => {
            const response = await getTopRatedMoviesAPI();
            setTopTrendingMovies(response.movies);
        }

        useFetchTopMovies();
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(async () => {
            if (searchQuery.trim() !== '') {
                const response = await searchMovieAPI(1, searchQuery);
                setIsLoading(false);
                setSearchedMovies(response.movies);
            }
        }, 100);

        setDebounceTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    return (
        <div className="search-result-page">
            <Container className="search-container">
                <Box className="search-header">
                    <Typography variant="h4" className="search-title">
                        Search Movies
                    </Typography>

                    <TextField
                        className="search-input"
                        placeholder="Search anything..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon className="search-icon" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box className="search-results">
                    {
                        isLoading ? (
                            <Box className='loading-circular'>
                                <CircularProgress />
                            </Box>
                        ) : (
                            searchedMovies?.length ? (
                                <>
                                    <Typography variant="body2" className="results-count">
                                        Found {searchedMovies?.length} results
                                    </Typography>

                                    <Box className='search-main-container'>
                                        <Box className='grid'>
                                            {searchedMovies.map((movie,) => (
                                                <MovieCard
                                                    premium={movie.premium}
                                                    id={movie.id}
                                                    title={movie.title}
                                                    posterImage={movie.poster_url}
                                                    rating={Number(movie.rating)}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </>
                            ) : (
                                <Box className='search-main-container'>
                                    <Box className='grid'>
                                        {topTrendingMovies.map((movie,) => (
                                            <MovieCard
                                                premium={movie.premium}
                                                id={movie.id}
                                                title={movie.title}
                                                posterImage={movie.poster_url}
                                                rating={Number(movie.rating)}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )
                        )
                    }
                </Box>
            </Container>
        </div>
    );
}

export default SearchResultPage;