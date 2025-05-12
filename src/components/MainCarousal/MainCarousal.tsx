import React, { Component, Key } from 'react';
import Slider, { Settings } from 'react-slick';
import './MainCarousal.scss';
import { Box, Typography } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { getAllMoviesAPI } from '../../API';
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
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                right: '10px',
                zIndex: 2,
                width: '40px',
                height: '40px',
            }}
            onClick={onClick}
        >
            <ArrowForwardIos style={{ color: 'white', fontSize: '20px' }} />
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
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                left: '10px',
                zIndex: 2,
                width: '40px',
                height: '40px',
            }}
            onClick={onClick}
        >
            <ArrowBackIos style={{ color: 'white', fontSize: '20px' }} />
        </Box>
    );
}

export class MainCarousal extends Component<{}, State> {
    constructor(props: object) {
        super(props);

        this.state = {
            allMovies: [],
            isSmallScreen: window.innerWidth < 500,
            loading: true
        };
    }

    truncateDescription(description: string) {
        if (this.state.isSmallScreen && description.length > 50) {
            return description.slice(0, 50) + "...";
        } else if (description.length > 100) {
            return description.slice(0, 300) + "...";
        } else {
            return description;
        }
    }

    handleResize = () => {
        this.setState({ isSmallScreen: window.innerWidth < 500 });
    }

    componentDidMount() {
        const fetchMovies = async () => {
            let response = await getAllMoviesAPI(1);
            this.setState({
                allMovies: response.movies, loading: false
            });
        }

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
        };

        return (
            <Box className='carousal-main-container'>
                <Box className="main-carousal">
                    {
                        this.state.loading ? (
                            <ShimmerMainCarousal />
                        ) : (
                            <Slider {...settings}>
                                {this.state.allMovies?.map((movie) => (
                                    <Box key={movie.id} className="carousel-item">
                                        <Box
                                            className="banner-image"
                                            sx={{ backgroundImage: `url(${movie.banner_url})` }}
                                        />
                                        <Box className="banner-content">
                                            <NavLink to={`movie-details/${movie.id}`}>
                                                <Box className="poster-container">
                                                    <img src={movie.poster_url} alt="Poster" className="poster-image" />
                                                </Box>
                                            </NavLink>
                                            <Box className='info-main-container'>
                                                <Box className="info-container">
                                                    <Typography variant="h3" className="movie-title">
                                                        {movie.title}
                                                    </Typography>
                                                    <Typography variant="body1" className="movie-description">
                                                        {this.truncateDescription(movie.description)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Slider>
                        )
                    }
                </Box>
            </Box>
        );
    }
}

export default MainCarousal;
