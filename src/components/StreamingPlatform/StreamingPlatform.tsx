import { Component, createRef } from 'react'
import './StreamingPlatforlm.scss';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import MovieCard from '../MovieCard/MovieCard';
import { ChevronRight } from 'lucide-react';
import Box from '@mui/material/Box';
import { getEveryMovieAPI } from '../../API';

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
    allMovies: Movie[];
    selectedPlatformMovies: Movie[];
}

interface StreamingPlatformProps { }

export class StreamingPlatform extends Component<StreamingPlatformProps, StreamingPlatformState> {
    carouselRef = createRef<HTMLBRElement>();
    cardWidth = 250;
    visibleCards = 5;
    scrollAmount = this.cardWidth * this.visibleCards;

    images: string[] = [
        'https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg?w=940',
        'https://yt3.googleusercontent.com/BE8oLlRJ4gzMqNyS5c0OnkuVsGH3tCWN6Zo5XjkR-BiPZObABCuQ-NDq-8sroOEMtX4kPv-9rg=s900-c-k-c0x00ffffff-no-rj',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmPmYVyCxBcDrsDxutlkSxHZYA2auvv81jiA&s', 
        'https://greenhouse.hulu.com/app/uploads/sites/12/2023/10/logo-gradient-3up.svg'
    ];

    constructor(props: StreamingPlatformProps) {
        super(props);
        this.state = {
            scrollPosition: 0,
            maxScrollReached: false,
            showControls: false,
            selectedIndex: 0,
            allMovies: [],
            selectedPlatformMovies: []
        };
    }

    componentDidMount(): void {
        const fetchMovies = async () => {
            let response = await getEveryMovieAPI();
            console.log("RESPONSE FROM API FETCH: ", response);
            this.setState({
                allMovies: response,
                selectedPlatformMovies: response.filter(movie => movie.streaming_platform === 'Netflix')
            });   
        }

        fetchMovies();

        const carousel = this.carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', this.updateScrollPosition);
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

        filteredMovies = this.state.allMovies.filter((mov) => {
            if (index === 0) return mov.streaming_platform === 'Netflix';
            if (index === 1) return mov.streaming_platform === 'Amazon';
            if (index === 2) return mov.streaming_platform === 'HBO';
            if (index === 3) return mov.streaming_platform === 'Hulu';
            return false;
        });
        

        this.setState({ selectedPlatformMovies: filteredMovies });
    };

    render() {
        const { scrollPosition, showControls } = this.state;

        const canScrollLeft = scrollPosition > 0;
        const canScrollRight = scrollPosition < (this.state.allMovies.length - this.visibleCards) * this.cardWidth;

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
                                        premium={movie.premium}
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

export default StreamingPlatform;
