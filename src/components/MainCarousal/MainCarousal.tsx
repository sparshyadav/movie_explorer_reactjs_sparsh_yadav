import React, { Component, Key } from 'react';
import Slider, { Settings } from 'react-slick';
import './MainCarousal.scss';
import { Box, Typography } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import NavigateWrapper from '../NavigateWrapper';

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

type Props = {
    navigate: (path: string) => void;
    movieContext: {
        setMovies: (movies: Movie[]) => void;
        movies: Movie[];
    }
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

type State = {
    allMovies: Movie[];
}

export class MainCarousal extends Component<Props> {
    state: State = {
        allMovies: [],
    };

    componentDidMount() {
        const { movieContext } = this.props;
        console.log("MOVIECONTEXT in Main Component: ", movieContext);
        if (movieContext && movieContext.movies) {
            this.setState({ allMovies: movieContext.movies });
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.movieContext.movies !== this.props.movieContext.movies &&
            this.props.movieContext.movies.length > 0
        ) {
            this.setState({ allMovies: this.props.movieContext.movies });
        }
    }

    render() {
        console.log("Movies: ", this.state.allMovies);

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
                    <Slider {...settings}>
                        {this.state.allMovies.map((movie) => (
                            <Box key={movie.id} className="carousel-item">
                                <Box
                                    className="banner-image"
                                    sx={{ backgroundImage: `url(${movie.banner_url})` }}
                                />
                                <Box className="banner-content">
                                    <Box className="poster-container">
                                        <img src={movie.poster_url} alt="Poster" className="poster-image" />
                                    </Box>
                                    <Box className='info-main-container'>
                                        <Box className="info-container">
                                            <Typography variant="h3" className="movie-title">
                                                {movie.title}
                                            </Typography>
                                            <Typography variant="body1" className="movie-description">
                                                {movie.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Slider>
                </Box>
            </Box>
        );
    }
}

export default NavigateWrapper(MainCarousal);


