import React, { useState } from 'react';
import './MovieCard.scss';
import { Add, Check } from '@mui/icons-material';

interface ShowCardProps {
    id: string;
    title: string;
    posterImage: string;
    rating: number;
    onAddToWatchlist?: (id: string, isAdded: boolean) => void;
}

const MovieCard: React.FC<ShowCardProps> = ({
    id,
    title,
    posterImage,
    rating,
    onAddToWatchlist
}) => {
    const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false);

    const handleWatchlistToggle = () => {
        const newState = !isInWatchlist;
        setIsInWatchlist(newState);
        if (onAddToWatchlist) {
            onAddToWatchlist(id, newState);
        }
    };

    return (
        <div className="netflix-show-card">
            <div className="poster-container">
                <img src={posterImage} alt={`${title} poster`} className="poster-image" />
            </div>

            <div className="show-info">
                <div className="rating-container">
                    <span className="star-icon">★</span>
                    <span className="rating">{rating.toFixed(1)}</span>
                    <span className="bookmark-icon">☆</span>
                </div>

                <div className="title-row">
                    <span className="title">{title}</span>
                </div>

                <button className="watch-options-btn">Watch options</button>

                <div className="action-buttons">
                    <button
                        className="watchlist-btn"
                        onClick={handleWatchlistToggle}
                        aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                    >
                        {isInWatchlist ? <Check /> : <Add />}
                        {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;