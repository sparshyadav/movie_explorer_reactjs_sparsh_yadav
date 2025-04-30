import React, { useEffect, useState } from 'react';
import { Star, Plus, Check } from 'lucide-react';
import './MovieDetails.scss';
import { useParams } from 'react-router-dom';
import { movieDetailsAPI } from '../../API';

interface Movie {
    title: string;
    release_year: number;
    duration: string;
    rating: number;
    poster_url: string;
    banner_url: string;
    genre: string;
    description: string;
    director: string;
    main_lead: string;
    streaming_platform: string;
}

const MovieDetails: React.FC = () => {
    const [userRating, setUserRating] = useState<number | null>(null);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);
    const { id } = useParams();

    const handleRating = (rating: number) => {
        setUserRating(rating);
    };

    const toggleWatchlist = () => {
        setInWatchlist(!inWatchlist);
    };

    useEffect(() => {
        const fetchMovieDetails = async () => {
            if (!id) return;
            try {
                const response = await movieDetailsAPI(Number(id));
                setMovie(response);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (!movie) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <div className="movie-page">
            <div className="banner">
                <div
                    className="banner__image"
                    style={{ backgroundImage: `url(${movie.banner_url})` }}
                >
                    <div className="banner__overlay"></div>
                </div>
            </div>

            <div className="container">
                <div className="movie-content">
                    <div className="movie-content__poster">
                        <img
                            src={movie.poster_url}
                            alt={`${movie.title} poster`}
                        />
                    </div>

                    <div className="movie-content__details">
                        <div className="movie-header">
                            <div className="movie-header__title-group">
                                <h1>{movie.title}</h1>
                                <div className="movie-meta">
                                    <span>{movie.release_year}</span>
                                    <span className="separator">•</span>
                                    <span>{movie.duration}</span>
                                </div>
                            </div>

                            <button
                                onClick={toggleWatchlist}
                                className={`watchlist-btn ${inWatchlist ? 'watchlist-btn--added' : ''}`}
                            >
                                {inWatchlist ? (
                                    <>
                                        <Check size={18} />
                                        <span>In Watchlist</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        <span>Add to Watchlist</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="genre-tags">
                            {movie.genre}
                        </div>

                        <div className="rating-section">
                            <div className="rating-display">
                                <div className="rating-badge">
                                    <Star className="star-icon" size={16} />
                                    <span>{movie.rating.toFixed(1)}</span>
                                </div>
                                <span className="rating-max">/10</span>
                            </div>
                            <div className="user-rating">
                                <p>Rate this movie:</p>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(null)}
                                            className="star-btn"
                                        >
                                            <Star
                                                size={24}
                                                className={`${(userRating && star <= userRating) || (hoverRating && star <= hoverRating)
                                                    ? 'star-btn__filled'
                                                    : 'star-btn__empty'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="movie-description">
                            <h2>Overview</h2>
                            <p>{movie.description}</p>
                        </div>
                        <div className="credits-section">
                            <div className="credits-item">
                                <h3>Director</h3>
                                <p>{movie.director}</p>
                            </div>
                            <div className="credits-item">
                                <h3>Lead Actor</h3>
                                <p>{movie.main_lead}</p>
                            </div>
                        </div>

                        <div className="streaming-section">
                            <h2>Available on</h2>
                            <div className="platform-list">
                                {movie.streaming_platform}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;


