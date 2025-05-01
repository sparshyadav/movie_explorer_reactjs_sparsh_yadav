import { Component, createRef } from 'react';
import './WhatToWatch.scss';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import MovieCard from '../../components/MovieCard/MovieCard';
import { ChevronRight } from 'lucide-react';
import { RootState } from '../../redux/store';
import { fetchMovies } from '../../redux/movieSlice';
import { connect } from 'react-redux';
import NavigateWrapper from '../NavigateWrapper';
import { NavLink } from 'react-router-dom';

interface Movie {
    id: string;
    title: string;
    poster_url: string;
    rating: number;
    premium: boolean;
}

interface WhatToWatchState {
    scrollPosition: number;
    maxScrollReached: boolean;
    showControls: boolean;
}

interface WhatToWatchProps {
    movies: Movie[];
    fetchMovies: () => void;
}


class WhatToWatch extends Component<WhatToWatchProps, WhatToWatchState> {
    carouselRef = createRef<HTMLBRElement>();
    cardWidth = 250;
    visibleCards = 5;
    scrollAmount = this.cardWidth * this.visibleCards;

    constructor(props: WhatToWatchProps) {
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

        this.props.fetchMovies();
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
        const canScrollRight = !maxScrollReached && scrollPosition < (this.props.movies.length - this.visibleCards) * this.cardWidth;
        const restrictedScrollRight = canScrollRight && scrollPosition < (10 - this.visibleCards) * this.cardWidth;

        return (
            <div className='main-container'>
                <div
                    className="netflix-card-carousel"
                    onMouseEnter={() => this.setState({ showControls: true })}
                >
                    <NavLink to={'/all-movies'}><h2 className="carousel-title">What to Watch <span className='title-icon'><ChevronRight className='next-icon' /></span></h2></NavLink>

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
                            {this.props.movies.map((movie) => (
                                <div className="carousel-item" key={movie.id}>
                                    <MovieCard
                                        premium={movie.premium}
                                        id={movie.id}
                                        title={movie.title}
                                        posterImage={movie.poster_url}
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

const mapStateToProps = (state: RootState) => ({
    movies: state.movies.movies
});

const mapDispatchToProps = {
    fetchMovies,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigateWrapper(WhatToWatch));

