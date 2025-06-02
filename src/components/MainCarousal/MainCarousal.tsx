import React, { Component, Key } from 'react';
import Slider, { Settings } from 'react-slick';
import './MainCarousal.scss';
import { Box, Typography } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { getTopRatedMoviesAPI } from '../../API';
import { NavLink } from 'react-router-dom';
import ShimmerMainCarousal from './ShimmerMainCarousal';

interface ArrowProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

type Movie = {
    id: Key | null | undefined;
    title: string;
    genre: string;
    release_year: string;
    rating: string;
    director: string;
    duration: string;
    streaming_platform: string;
    main_lead: string;
    description: string;
    premium: boolean;
    poster_url: string;
    banner_url: string;
}

type State = {
    allMovies: Movie[];
    isSmallScreen: boolean;
    loading: boolean;
    error: string | null;
}

function NextArrow({ className, style, onClick }: ArrowProps) {
    return (
        <Box
            className={className}
            style={{
                ...style,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                right: '0px',
                zIndex: 10,
                width: '50px',
                height: '50px',
                cursor: 'pointer',
            }}
            onClick={onClick}
        >
            <ArrowForwardIos style={{ color: 'white', fontSize: '35px' }} />
        </Box>
    );
}

function PrevArrow({ className, style, onClick }: ArrowProps) {
    return (
        <Box
            className={className}
            style={{
                ...style,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                left: '0px',
                zIndex: 10,
                width: '50px',
                height: '50px',
                cursor: 'pointer',
            }}
            onClick={onClick}
        >
            <ArrowBackIos style={{ color: 'white', fontSize: '35px', marginLeft: '8px' }} />
        </Box>
    );
}

export class MainCarousal extends Component<{}, State> {
    constructor(props: object) {
        super(props);

        this.state = {
            allMovies: [],
            isSmallScreen: window.innerWidth < 500,
            loading: true,
            error: null,
        };
    }

    truncateDescription(description: string) {
        if (this.state.isSmallScreen && description.length > 50) {
            return description.slice(0, 50) + "...";
        } else if (description.length > 300) {
            return description.slice(0, 300) + "...";
        }
        return description;
    }

    handleResize = () => {
        this.setState({ isSmallScreen: window.innerWidth < 500 });
    }

    componentDidMount() {
        const fetchMovies = async () => {
            try {
                const response = await getTopRatedMoviesAPI();
                console.log("RESULT: ", response);
                this.setState({
                    allMovies: Array.isArray(response.movies) ? response.movies : [],
                    loading: false,
                });
            } catch (error) {
                console.error("Failed to fetch movies:", error);
                this.setState({ error: "Failed to load movies", loading: false });
            }
        };

        fetchMovies();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    render() {
        const settings: Settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            pauseOnHover: true,
            arrows: true,
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />,
            adaptiveHeight: false,
        };

        const { allMovies, loading, error, isSmallScreen } = this.state;

        return (
            <Box className='carousal-main-container'>
                <Box className="main-carousal">
                    {loading ? (
                        <ShimmerMainCarousal />
                    ) : error ? (
                        <Typography variant="h6" color="error" textAlign="center">
                            {error}
                        </Typography>
                    ) : allMovies.length === 0 ? (
                        <Typography variant="h6" color="textSecondary" textAlign="center">
                            No movies available
                        </Typography>
                    ) : (
                        <Slider {...settings}>
                            {allMovies.map((movie) => (
                                <Box key={movie.id} className="carousel-item">
                                    <Box
                                        className="banner-image"
                                        sx={{ backgroundImage: `url(${movie.banner_url})` }}
                                    />
                                    <Box className="banner-content">
                                        <NavLink to={`/movie-details/${movie.id}`}>
                                            <Box className="main-carousal-poster-container poster-container">
                                                <img src={movie.poster_url} alt={`${movie.title} Poster`} className="poster-image" />
                                            </Box>
                                        </NavLink>
                                        <Box className='info-main-container'>
                                            <Box className="info-container">
                                                <Typography variant={isSmallScreen ? "h4" : "h3"} className="main-carousal-movie-title movie-title">
                                                    {movie.title}
                                                </Typography>
                                                <Typography variant="body1" className="main-carousal-movie-description movie-description">
                                                    {this.truncateDescription(movie.description)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Slider>
                    )}
                </Box>
            </Box>
        );
    }
}

export default MainCarousal;