import { Component, createRef } from 'react';
import './WhatToWatch.scss';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import MovieCard from '../../components/MovieCard/MovieCard';
import { ChevronRight } from 'lucide-react';

interface Movie {
    id: string;
    title: string;
    posterImage: string;
    rating: number;
}

interface WhatToWatchState {
    scrollPosition: number;
    maxScrollReached: boolean;
    showControls: boolean;
}

class WhatToWatch extends Component<object, WhatToWatchState> {
    carouselRef = createRef<HTMLDivElement>();
    cardWidth = 250;
    visibleCards = 5;
    scrollAmount = this.cardWidth * this.visibleCards;

    movies: Movie[] = [
        {
            id: '1',
            title: 'Inception',
            posterImage: 'https://irs.www.warnerbros.com/keyart-jpeg/inception_keyart.jpg',
            rating: 8.8,
        },
        {
            id: '2',
            title: 'The Dark Knight',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg',
            rating: 9.0,
        },
        {
            id: '3',
            title: 'Interstellar',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
            rating: 8.6,
        },
        {
            id: '4',
            title: 'Stranger Things',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BMjg2NmM0MTEtYWY2Yy00NmFlLTllNTMtMjVkZjEwMGVlNzdjXkEyXkFqcGc@._V1_.jpg',
            rating: 8.7,
        },
        {
            id: '5',
            title: 'Breaking Bad',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BMzU5ZGYzNmQtMTdhYy00OGRiLTg0NmQtYjVjNzliZTg1ZGE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
            rating: 9.5,
        },
        {
            id: '6',
            title: 'Money Heist',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BZjkxZWJiNTUtYjQwYS00MTBlLTgwODQtM2FkNWMyMjMwOGZiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
            rating: 8.3,
        },
        {
            id: '7',
            title: 'The Witcher',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BMTQ5MDU5MTktMDZkMy00NDU1LWIxM2UtODg5OGFiNmRhNDBjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
            rating: 8.2,
        },
        {
            id: '8',
            title: 'Peaky Blinders',
            posterImage: 'https://m.media-amazon.com/images/M/MV5BOGM0NGY3ZmItOGE2ZC00OWIxLTk0N2EtZWY4Yzg3ZDlhNGI3XkEyXkFqcGc@._V1_.jpg',
            rating: 8.8,
        }
    ];

    constructor(props: object) {
        super(props);
        this.state = {
            scrollPosition: 0,
            maxScrollReached: false,
            showControls: false,
        };
    }

    componentDidMount() {
        const carousel = this.carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', this.updateScrollPosition);
        }
    }

    componentWillUnmount() {
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
                maxScrollReached: newPosition >= maxScroll - 20,
            });
        }
    };

    handleScroll = (direction: 'left' | 'right') => {
        const { scrollPosition } = this.state;
        const carousel = this.carouselRef.current;

        if (carousel) {
            const newPosition = direction === 'left'
                ? Math.max(scrollPosition - this.scrollAmount, 0)
                : scrollPosition + this.scrollAmount;

            carousel.scrollTo({
                left: newPosition,
                behavior: 'smooth',
            });
        }
    };

    render() {
        const { scrollPosition, maxScrollReached, showControls } = this.state;

        const canScrollLeft = scrollPosition > 0;
        const canScrollRight = !maxScrollReached && scrollPosition < (this.movies.length - this.visibleCards) * this.cardWidth;
        const restrictedScrollRight = canScrollRight && scrollPosition < (10 - this.visibleCards) * this.cardWidth;

        return (
            <div className='main-container'>
                <div
                    className="netflix-card-carousel"
                    onMouseEnter={() => this.setState({ showControls: true })}
                >
                    <h2 className="carousel-title">What to Watch <span className='title-icon'><ChevronRight className='next-icon' /></span></h2>

                    <div className="carousel-container">
                        {showControls && canScrollLeft && (
                            <button
                                className="carousel-control left-control"
                                onClick={() => this.handleScroll('left')}
                                aria-label="Scroll left"
                            >
                                <ArrowBackIos />
                            </button>
                        )}

                        <div className="carousel-track" ref={this.carouselRef}>
                            {this.movies.map((movie) => (
                                <div className="carousel-item" key={movie.id}>
                                    <MovieCard
                                        id={movie.id}
                                        title={movie.title}
                                        posterImage={movie.posterImage}
                                        rating={movie.rating}
                                    />
                                </div>
                            ))}
                        </div>

                        {showControls && restrictedScrollRight && (
                            <button
                                className="carousel-control right-control"
                                onClick={() => this.handleScroll('right')}
                                aria-label="Scroll right"
                            >
                                <ArrowForwardIos />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default WhatToWatch;
