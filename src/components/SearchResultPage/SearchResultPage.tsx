import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Box, Container, Typography, TextField, InputAdornment, Grid } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import './SearchResultPage.scss';
import { searchMovieAPI } from '../../API';
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

    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setIsLoading(true);
        setSearchQuery(value);
    };

    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(async () => {
            if (searchQuery.trim() !== '') {
                const response = await searchMovieAPI(1, searchQuery);
                setIsLoading(false);
                setSearchedMovies(response.movies);
            }
        }, 2500);

        setDebounceTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    return (
        <div className="search-result-page">
            <Navbar />

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
                            <>
                                <Typography variant="body2" className="results-count">
                                    Found {searchedMovies?.length} results
                                </Typography>

                                <Box className='search-main-container'>
                                    <Grid container spacing={4} className='grid'>
                                        {searchedMovies.map((movie,) => (
                                            <MovieCard
                                                premium={movie.premium}
                                                id={movie.id}
                                                title={movie.title}
                                                posterImage={movie.poster_url}
                                                rating={Number(movie.rating)}
                                            />
                                        ))}
                                    </Grid>
                                </Box>
                            </>
                        )
                    }
                </Box>
            </Container>
            <Footer />
        </div>
    );
}

export default SearchResultPage;