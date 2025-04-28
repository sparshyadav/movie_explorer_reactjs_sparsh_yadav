import { Component, createRef } from 'react'
import './StreamingPlatforlm.scss';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import MovieCard from '../MovieCard/MovieCard';
import { ChevronRight } from 'lucide-react';
import Box from '@mui/material/Box';

interface Movie {
    id: string;
    title: string;
    posterImage: string;
    rating: number;
    platform: string;
}

interface StreamingPlatformState {
    scrollPosition: number;
    maxScrollReached: boolean;
    showControls: boolean;
    selectedIndex: number;
    selectedPlatformMovies: Movie[];
}

export class StreamingPlatform extends Component<object, StreamingPlatformState> {
    carouselRef = createRef<HTMLBRElement>();
    cardWidth = 250;
    visibleCards = 5;
    scrollAmount = this.cardWidth * this.visibleCards;

    movies: Movie[] = [
        {
            id: '1',
            title: 'Inception',
            posterImage: 'https://irs.www.warnerbros.com/keyart-jpeg/inception_keyart.jpg',
            rating: 8.8,
            platform: 'Netflix'
        },
        {
            id: '2',
            title: 'The Dark Knight',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg',
            rating: 9.0,
            platform: 'Netflix'
        },
        {
            id: '3',
            title: 'Interstellar',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
            rating: 8.6,
            platform: 'Netflix'
        },
        {
            id: '4',
            title: 'Stranger Things',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BMjg2NmM0MTEtYWY2Yy00NmFlLTllNTMtMjVkZjEwMGVlNzdjXkEyXkFqcGc@._V1_.jpg',
            rating: 8.7,
            platform: 'Netflix'
        },
        {
            id: '5',
            title: 'Breaking Bad',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BMzU5ZGYzNmQtMTdhYy00OGRiLTg0NmQtYjVjNzliZTg1ZGE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
            rating: 9.5,
            platform: 'Netflix'
        },
        {
            id: '6',
            title: 'Money Heist',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BZjkxZWJiNTUtYjQwYS00MTBlLTgwODQtM2FkNWMyMjMwOGZiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
            rating: 8.3,
            platform: 'Netflix'
        },
        {
            id: '7',
            title: 'The Witcher',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BMTQ5MDU5MTktMDZkMy00NDU1LWIxM2UtODg5OGFiNmRhNDBjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
            rating: 8.2,
            platform: 'Netflix'
        },
        {
            id: '8',
            title: 'Peaky Blinders',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BOGM0NGY3ZmItOGE2ZC00OWIxLTk0N2EtZWY4Yzg3ZDlhNGI3XkEyXkFqcGc@._V1_.jpg',
            rating: 8.8,
            platform: 'Netflix'
        },
        {
            id: '9',
            title: 'The Boys',
            posterImage: 'https://m.media-amazon.com/images/I/710-pag9eJL.jpg',
            rating: 8.7,
            platform: 'Amazon Prime'
        },
        {
            id: '10',
            title: 'Jack Ryan',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BNGYxNzgzNTQtY2U0OC00NzU2LTgxZmYtNmZkMmVlMjgyMzM3XkEyXkFqcGc@._V1_.jpg',
            rating: 8.1,
            platform: 'Amazon Prime'
        },
        {
            id: '11',
            title: 'Reacher',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BMzdjYWZlMDQtYzdhNi00NmRlLTg2NzUtMTI3MWFhZDliNjBiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
            rating: 8.2,
            platform: 'Amazon Prime'
        },
        {
            id: '12',
            title: 'The Marvelous Mrs. Maisel',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BZjM3MmFjMzYtMGNiYi00MDZmLTlkM2MtNzI3MDg1MzUwYWY2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
            rating: 8.7,
            platform: 'Amazon Prime'
        },
        {
            id: '13',
            title: 'Special Ops',
            posterImage: 'https://image.tmdb.org/t/p/original/7p0nbWCGsHf2sgxJer2AuCx6zwF.jpg',
            rating: 8.5,
            platform: 'Hotstar'
        },
        {
            id: '14',
            title: 'Criminal Justice',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BNzQ1ZTcwODAtOTRkYy00NzRjLTgyYjEtYzg3NzQ1N2YyNmU1XkEyXkFqcGc@._V1_.jpg',
            rating: 8.1,
            platform: 'Hotstar'
        },
        {
            id: '15',
            title: 'Aarya',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BZGQ3OGQ2ZjktODhlMy00YTg2LWIxOTEtYzI5Mjg3MGNkMDQzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
            rating: 7.9,
            platform: 'Hotstar'
        },
        {
            id: '16',
            title: 'The Mandalorian',
            posterImage: 'https://lumiere-a.akamaihd.net/v1/images/sw_themandalorian_s3_teaser_digital_ka_v6_lg_95cf4c0a.jpeg?region=0,0,2500,3704',
            rating: 8.7,
            platform: 'Hotstar'
        }
    ];

    images: string[] = [
        'https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg?w=940',
        'https://yt3.googleusercontent.com/BE8oLlRJ4gzMqNyS5c0OnkuVsGH3tCWN6Zo5XjkR-BiPZObABCuQ-NDq-8sroOEMtX4kPv-9rg=s900-c-k-c0x00ffffff-no-rj',
        'https://cdn.bio.link/uploads/profile_pictures/2023-07-06/vn7NYMznyjqnud4wdNCGVZz5S1bfmkN6.png'
    ];

    constructor(props: object) {
        super(props);
        this.state = {
            scrollPosition: 0,
            maxScrollReached: false,
            showControls: false,
            selectedIndex: 0,
            selectedPlatformMovies: []
        };
    }

    componentDidMount(): void {
        const carousel = this.carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', this.updateScrollPosition);
        }

        const filteredMovies: Movie[] = this.movies.filter((mov) => mov.platform === 'Netflix');

        this.setState({ selectedPlatformMovies: filteredMovies });
    }

    componentWillUnmount(): void {
        const carousel = this.carouselRef.current;
        if (carousel) {
            carousel.removeEventListener('scroll', this.updateScrollPosition);
        }
    }

    updateScrollPosition = () => {
        const carousel = this.carouselRef.current;
        if (carousel) {
            const newPosition = carousel.scrollLeft;
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;

            this.setState({
                scrollPosition: newPosition,
                maxScrollReached: newPosition >= maxScroll - 20
            })
        }
    }

    handleScroll = (direction: 'left' | 'right') => {
        const { scrollPosition } = this.state;
        const carousel = this.carouselRef.current;

        if (carousel) {
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            let newPosition;

            if (direction === 'left') {
                newPosition = Math.max(scrollPosition - this.scrollAmount, 0);
            } else {
                newPosition = Math.min(scrollPosition + this.scrollAmount, maxScroll);
            }

            carousel.scrollTo({
                left: newPosition,
                behavior: 'smooth',
            });
        }
    };

    handleImageClick = (index: number) => {
        this.setState({ selectedIndex: index });

        let filteredMovies: Movie[] = [];

        if (index === 0) {
            filteredMovies = this.movies.filter((mov) => mov.platform === 'Netflix');
        } else if (index === 1) {
            filteredMovies = this.movies.filter((mov) => mov.platform === 'Amazon Prime');
        } else if (index === 2) {
            filteredMovies = this.movies.filter((mov) => mov.platform === 'Hotstar');
        }

        this.setState({ selectedPlatformMovies: filteredMovies });

    };

    render() {
        const { scrollPosition, showControls } = this.state;

        const canScrollLeft = scrollPosition > 0;
        const canScrollRight = scrollPosition < (this.movies.length - this.visibleCards) * this.cardWidth;

        return (
            <Box className='main-container'>
                <Box
                    className="netflix-card-carousel"
                    onMouseEnter={() => this.setState({ showControls: true })}
                >
                    <h2 className="carousel-title">Explore What's Streaming <span className='title-icon'><ChevronRight className='next-icon' /></span></h2>

                    <Box className='platform-options'>
                        {this.images.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`Platform ${index}`}
                                className={this.state.selectedIndex === index ? 'selected' : ''}
                                onClick={() => this.handleImageClick(index)}
                            />
                        ))}
                    </Box>

                    <Box className="carousel-container">
                        {showControls && canScrollLeft && (
                            <button
                                className="carousel-control left-control"
                                onClick={() => this.handleScroll('left')}
                                aria-label="Scroll left"
                            >
                                <ArrowBackIos />
                            </button>
                        )}

                        <Box className="carousel-track" ref={this.carouselRef}>
                            {this.state.selectedPlatformMovies.map((movie) => (
                                <Box className="carousel-item" key={movie.id}>
                                    <MovieCard
                                        id={movie.id}
                                        title={movie.title}
                                        posterImage={movie.posterImage}
                                        rating={movie.rating}
                                    />
                                </Box>
                            ))}
                        </Box>

                        {showControls && canScrollRight && (
                            <button
                                className="carousel-control right-control"
                                onClick={() => this.handleScroll('right')}
                                aria-label="Scroll right"
                            >
                                <ArrowForwardIos />
                            </button>
                        )}
                    </Box>
                </Box>
            </Box>
        )
    }
}

export default StreamingPlatform
