import React from 'react';
import Box from '@mui/material/Box';
import './MovieCardShimmer.scss';

interface MovieCardShimmerProps {
    count?: number;
}

const MovieCardShimmer: React.FC<MovieCardShimmerProps> = ({ count = 1 }) => {
    return (
        <>
            {Array(count).fill(0).map((_, index) => (
                <Box key={index} className="netflix-show-card shimmer-card">
                    <Box className="poster-container shimmer-container">
                        <Box className="poster-image shimmer-effect" />
                        <Box className="shimmer-badge shimmer-effect" />
                    </Box>

                    <Box className="show-info">
                        <Box className="rating-container">
                            <Box className="rating-info shimmer-effect" />
                            <Box className="bookmark-container shimmer-effect" />
                        </Box>

                        <Box className="title-row">
                            <Box className="title shimmer-effect" />
                        </Box>

                        <Box className="watch-options-btn shimmer-effect" />

                        <Box className="action-buttons">
                            <Box className="watchlist-btn shimmer-effect" />
                        </Box>
                    </Box>
                </Box>
            ))}
        </>
    );
};

export default MovieCardShimmer;