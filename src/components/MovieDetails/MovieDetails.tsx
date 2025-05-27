import React, { useEffect, useState } from 'react';
import { Star, Plus, Check } from 'lucide-react';
import './MovieDetails.scss';
import { useParams } from 'react-router-dom';
import { addToWatchlist, getWatchlist, movieDetailsAPI, removeFromWatchlist } from '../../API';
import WhatToWatch from '../WhatToWatch/WhatToWatch';
import TopLineLoader from './TopLineLoader/TopLineLoader';

type StreamingPlatform = 'Netflix' | 'Amazon' | 'HBO';

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
    streaming_platform: StreamingPlatform;
}

const MovieDetails: React.FC = () => {
    const [userRating, setUserRating] = useState<number | null>(null);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [isWatchlisted, setIsWatchlisted] = useState<boolean>(false);
    const { id } = useParams();

    const handleRating = (rating: number) => {
        setUserRating(rating);
    };

    const toggleWatchlist = async () => {
        try {
            if (isWatchlisted) {
                await handleRemoveWatchlist();
                setIsWatchlisted(false);
            } else {
                await handleAddWatchlist();
                setIsWatchlisted(true);
            }
        } catch (error) {
            console.error("Failed to toggle watchlist:", error);
        }
    };


    const streaming_platform_url = {
        Netflix: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Netflix_logo.svg/2560px-Netflix_logo.svg.png',
        Amazon: 'https://pentagram-production.imgix.net/38cf1cca-b7de-4393-85b9-cf36de0e38cf/Amazon_PrimeVideo_Documentation_02copy.jpg?crop=edges&fit=crop&h=630&rect=192%2C0%2C3456%2C2160&w=1200',
        HBO: 'https://9meters.com/wp-content/uploads/hbo-max-logo.webp',
        Hulu: 'https://greenhouse.hulu.com/app/uploads/sites/12/2023/10/logo-gradient-3up.svg'
    };

    useEffect(() => {
        const fetchMovieDetails = async () => {
            if (!id) return;
            try {
                const response = await movieDetailsAPI(Number(id));
                setMovie(response);

                if (response.streaming_platform in streaming_platform_url) {
                    setImageUrl(streaming_platform_url[response.streaming_platform as StreamingPlatform]);
                } else {
                    setImageUrl('');
                }
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        const allWatchlistedMovies = async () => {
            const response = await getWatchlist();
            const isInWatchlist = response.some((mov: any) => String(mov.id) === String(id));

            if (isInWatchlist) {
                setIsWatchlisted(true);
            }

            console.log("RESPONSE OF WATCHLIST MOVIES: ", response);
        }

        fetchMovieDetails();
        allWatchlistedMovies();
    }, [id]);

    const handleAddWatchlist = async () => {
        const response = await addToWatchlist(Number(id));
        console.log('Response of watchlsit: ', response);
    }

    const handleRemoveWatchlist = async () => {
        const response = await removeFromWatchlist(Number(id));
        console.log('Response of watchlsit: ', response);
    }

    if (!movie) {
        return (
            <TopLineLoader />
        )
    }

    return (
        <>
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
                                        <span>{movie.duration} mins</span>
                                    </div>
                                </div>

                                <button
                                    onClick={toggleWatchlist}
                                    className={`watchlist-btn ${isWatchlisted ? 'watchlist-btn--added' : ''}`}
                                >
                                    <div className='wtchlst-btn'>
                                        {isWatchlisted ? (
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
                                    </div>
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
                                    <div className="movie-box">
                                        <img
                                            src={imageUrl}
                                            alt={`${movie.streaming_platform} logo`}
                                            className="movie-poster"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            <WhatToWatch />
        </>
    );
};

export default MovieDetails;