import { Component, createRef } from 'react';
import './Watchlist.scss';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import MovieCard from '../../components/MovieCard/MovieCard';
import MovieCardShimmer from '../../components/MovieCardShimmer/MovieCardShimmer';
import { ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { getWatchlist } from '../../API';

interface Movie {
    id: string;
    title: string;
    poster_url: string;
    rating: number;
    premium: boolean;
}

interface WatchlistState {
    scrollPosition: number;
    maxScrollReached: boolean;
    showControls: boolean;
    allMovies: Movie[];
    isLoading: boolean;
}

class Watchlist extends Component<{}, WatchlistState> {
    carouselRef = createRef<HTMLDivElement>();
    cardWidth = 250;
    visibleCards = 5;
    scrollAmount = this.cardWidth * this.visibleCards;

    constructor(props: object) {
        super(props);
        this.state = {
            scrollPosition: 0,
            maxScrollReached: false,
            showControls: false,
            allMovies: [],
            isLoading: true
        };
    }

    componentDidMount() {
        const fetchMovies = async () => {
            this.setState({ isLoading: true });
            let response = await getWatchlist();
            this.setState({
                allMovies: response,
                isLoading: false
            });
        }

        fetchMovies();

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

    renderShimmerCards = () => {
        const shimmerItems = Array(8).fill(0);

        return shimmerItems.map((_, index) => (
            <div className="watchlist-carousel-item" key={`shimmer-${index}`}>
                <MovieCardShimmer />
            </div>
        ));
    };

    renderMovieCards = () => {
        return this.state.allMovies.map((movie) => (
            <div className="watchlist-carousel-item" key={movie.id}>
                <MovieCard
                    premium={movie.premium}
                    id={movie.id}
                    title={movie.title}
                    posterImage={movie.poster_url}
                    rating={movie.rating}
                />
            </div>
        ));
    };

    render() {
        const { scrollPosition, maxScrollReached, showControls, isLoading } = this.state;

        const canScrollLeft = scrollPosition > 0;
        const canScrollRight = !maxScrollReached && !isLoading && scrollPosition < (this.state.allMovies.length - this.visibleCards) * this.cardWidth;
        const restrictedScrollRight = canScrollRight && scrollPosition < (10 - this.visibleCards) * this.cardWidth;

        return (
            <div className='watchlist-main-container'>
                <div
                    className="watchlist-netflix-card-carousel"
                    onMouseEnter={() => this.setState({ showControls: true })}
                    onMouseLeave={() => this.setState({ showControls: false })}
                >
                    <NavLink to={'/watchlist'}>
                        <h2 className="watchlist-carousel-title">
                            Your Watchlist
                            <span className='watchlist-title-icon'>
                                <ChevronRight className='watchlist-next-icon' />
                            </span>
                        </h2>
                    </NavLink>

                    <div className="watchlist-carousel-container">
                        {showControls && canScrollLeft && (
                            <button
                                className="watchlist-carousel-control watchlist-left-control"
                                onClick={() => this.handleScroll('left')}
                                aria-label="Scroll left"
                            >
                                <ArrowBackIos />
                            </button>
                        )}

                        <div className="watchlist-carousel-track" ref={this.carouselRef}>
                            {isLoading ? this.renderShimmerCards() : this.renderMovieCards()}
                        </div>

                        {showControls && restrictedScrollRight && (
                            <button
                                className="watchlist-carousel-control watchlist-right-control"
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

export default Watchlist;