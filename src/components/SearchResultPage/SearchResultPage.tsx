import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Box, Container, Typography, Chip, TextField, InputAdornment, Grid, Pagination } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import './SearchResultPage.scss';
import { getMoviesByGenre, searchMovieAPI } from '../../API';
import MovieCard from '../MovieCard/MovieCard';
import { KeyboardEvent } from 'react';
import { X } from 'lucide-react';

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
    const [genres, setGenres] = useState<string[]>(['Action', 'Si-Fi', 'Thriller', 'Drama', 'Romance']);
    const [addingGenre, setAddingGenre] = useState(false);
    const [newGenreName, setNewGenreName] = useState('');
    const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);
    };

    const handleFilter = async (genre: string) => {
        let response = await getMoviesByGenre(genre, 1);
        console.log("RESPONSE FOR GENRE: ", response);
        setSearchedMovies(response.movies);
    }
    
    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
    
        const timeout = setTimeout(async () => {
            if (searchQuery.trim() !== '') {
                const response = await searchMovieAPI(1, searchQuery);
                setSearchedMovies(response.movies);
                console.log('Debounced Search Result:', response);
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
                        Search Results
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

                    <Box className="search-filters">
                        <Typography variant="subtitle1" className="filter-label">
                            Popular filters:
                        </Typography>

                        <Box className="filter-chips">
                            {genres.map((genre) => (
                                <Box
                                    key={genre}
                                    onMouseEnter={() => setHoveredGenre(genre)}
                                    onMouseLeave={() => setHoveredGenre(null)}
                                    sx={{ position: 'relative', display: 'inline-flex' }}
                                >
                                    <Chip
                                        label={genre}
                                        onClick={() => handleFilter(genre)}
                                        clickable
                                        sx={{
                                            backgroundColor: 'black',
                                            color: 'yellow',
                                            border: '1px solid yellow',
                                            mr: 1,
                                            '&:hover': {
                                                borderColor: 'yellow',
                                                backgroundColor: '#111',
                                            },
                                        }}
                                    />
                                    {hoveredGenre === genre && (
                                        <X
                                            size={15}
                                            style={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                cursor: 'pointer',
                                                color: 'yellow',
                                                background: 'black',
                                                borderRadius: '50%',
                                                padding: 2,
                                            }}
                                            onClick={() => setGenres((prev) => prev.filter((g) => g !== genre))}
                                        />
                                    )}
                                </Box>
                            ))}

                            {addingGenre ? (
                                <TextField
                                    value={newGenreName}
                                    onChange={(e) => setNewGenreName(e.target.value)}
                                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                                        const trimmed = newGenreName.trim();

                                        if (e.key === 'Enter') {
                                            if (trimmed) {
                                                if (!genres.includes(trimmed)) {
                                                    setGenres((prev) => [...prev, trimmed]);
                                                }
                                            }

                                            setNewGenreName('');
                                            setAddingGenre(false);
                                        } else if (e.key === 'Escape') {
                                            setNewGenreName('');
                                            setAddingGenre(false);
                                        }
                                    }}

                                    variant="outlined"
                                    size="extra-small"
                                    autoFocus
                                    sx={{
                                        input: {
                                            backgroundColor: 'black',
                                            color: 'yellow',
                                            border: '1px solid yellow',
                                            borderRadius: '16px',
                                            padding: '6px 12px',
                                            width: '100px',
                                            caretColor: 'yellow',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border: 'none'
                                            },
                                            '&:hover fieldset': {
                                                border: 'none'
                                            },
                                            '&.Mui-focused fieldset': {
                                                border: 'none'
                                            },
                                        },
                                        mr: 1,
                                    }}
                                />
                            ) : (
                                <Chip
                                    label="+"
                                    onClick={() => setAddingGenre(true)}
                                    clickable
                                    sx={{
                                        backgroundColor: 'black',
                                        color: 'yellow',
                                        border: '1px dashed yellow',
                                        '&:hover': {
                                            borderColor: 'yellow',
                                            backgroundColor: '#111',
                                        },
                                    }}
                                />
                            )}
                        </Box>

                    </Box>
                </Box>

                <Box className="search-results">
                    <Typography variant="body2" className="results-count">
                        Found {searchedMovies.length} results
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

                    <Box className="pagination-container">
                        <Pagination count={10} color="primary" size="large" />
                    </Box>
                </Box>
            </Container>

            <Footer />
        </div>
    );
}

export default SearchResultPage;