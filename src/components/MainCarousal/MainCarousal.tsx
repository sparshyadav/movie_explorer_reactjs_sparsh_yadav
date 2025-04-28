import React, { Component } from 'react';
import Slider, { Settings } from 'react-slick';
import './MainCarousal.scss';
import { Box, Typography } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

interface ArrowProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
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

interface Movie {
    id: number;
    title: string;
    description: string;
    banner: string;
    poster: string;
}

export class MainCarousal extends Component {
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

        const movies: Movie[] = [
            {
                id: 1,
                title: "Avengers: Endgame",
                description: "After the devastating events of Avengers: Infinity War, the universe is in ruins...",
                banner: "https://disney.images.edge.bamgrid.com/ripcut-delivery/v1/variant/disney/7b350a2f-0b3e-4033-8125-34c4d67e3bbe?/scale?width=1200&aspectRatio=1.78&format=webp",
                poster: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_FMjpg_UX1000_.jpg",
            },
            {
                id: 2,
                title: "The Batman",
                description: "In his second year of fighting crime, Batman uncovers corruption in Gotham...",
                banner: "https://www.thebatman.com/images/banner_img.jpg",
                poster: "https://m.media-amazon.com/images/S/pv-target-images/3de84cca07fc963b66a01a5465c2638066119711e89c707ce952555783dd4b4f.jpg",
            },
            {
                id: 3,
                title: "Interstellar",
                description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                banner: "https://www.hauweele.net/~gawen/blog/wp-content/uploads/2014/11/interstellar.jpg",
                poster: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
            },
        ];

        return (
            <Box className='carousal-main-container'>
                <Box className="main-carousal">
                    <Slider {...settings}>
                        {movies.map((movie) => (
                            <Box key={movie.id} className="carousel-item">
                                <Box
                                    className="banner-image"
                                    sx={{ backgroundImage: `url(${movie.banner})` }}
                                />
                                <Box className="banner-content">
                                    <Box className="poster-container">
                                        <img src={movie.poster} alt="Poster" className="poster-image" />
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

export default MainCarousal;


