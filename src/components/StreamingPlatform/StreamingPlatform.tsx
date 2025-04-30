import { Component, createRef } from 'react'
import './StreamingPlatforlm.scss';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import MovieCard from '../MovieCard/MovieCard';
import { ChevronRight } from 'lucide-react';
import Box from '@mui/material/Box';
import { RootState } from '../../redux/store';
import { fetchMovies } from '../../redux/movieSlice';
import NavigateWrapper from '../NavigateWrapper';
import { connect } from 'react-redux';

interface Movie {
    id: string;
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
    banner: string;
}

interface StreamingPlatformState {
    scrollPosition: number;
    maxScrollReached: boolean;
    showControls: boolean;
    selectedIndex: number;
    selectedPlatformMovies: Movie[];
}

interface StreamingPlatformProps {
    movies: Movie[];
    fetchMovies: () => void;
}

export class StreamingPlatform extends Component<StreamingPlatformProps, StreamingPlatformState> {
    carouselRef = createRef<HTMLBRElement>();
    cardWidth = 250;
    visibleCards = 5;
    scrollAmount = this.cardWidth * this.visibleCards;

    images: string[] = [
        'https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg?w=940',
        'https://yt3.googleusercontent.com/BE8oLlRJ4gzMqNyS5c0OnkuVsGH3tCWN6Zo5XjkR-BiPZObABCuQ-NDq-8sroOEMtX4kPv-9rg=s900-c-k-c0x00ffffff-no-rj',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmPmYVyCxBcDrsDxutlkSxHZYA2auvv81jiA&s'
    ];

    constructor(props: StreamingPlatformProps) {
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
        this.props.fetchMovies();

        const carousel = this.carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', this.updateScrollPosition);
        }
    }

    componentDidUpdate(prevProps: StreamingPlatformProps) {
        if (prevProps.movies !== this.props.movies && this.props.movies.length > 0) {
            const filteredMovies = this.props.movies.filter(
                (mov) => mov.streaming_platform === 'Netflix'
            );

            this.setState({ selectedPlatformMovies: filteredMovies });
        }
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
            filteredMovies = this.props.movies.filter((mov) => mov.streaming_platform === 'Netflix');
        } else if (index === 1) {
            filteredMovies = this.props.movies.filter((mov) => mov.streaming_platform === 'Amazon');
        } else if (index === 2) {
            filteredMovies = this.props.movies.filter((mov) => mov.streaming_platform === 'HBO');
        }

        this.setState({ selectedPlatformMovies: filteredMovies });
    };

    render() {
        const { scrollPosition, showControls } = this.state;

        const canScrollLeft = scrollPosition > 0;
        const canScrollRight = scrollPosition < (this.props.movies.length - this.visibleCards) * this.cardWidth;

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
                                        posterImage={movie.poster_url}
                                        rating={Number(movie.rating)}
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

const mapStateToProps = (state: RootState) => ({
    movies: state.movies.movies,
});

const mapDispatchToProps = {
    fetchMovies,
};

const ConnectedStreamingPlatform = connect(mapStateToProps, mapDispatchToProps)(StreamingPlatform);
export default NavigateWrapper(ConnectedStreamingPlatform);

