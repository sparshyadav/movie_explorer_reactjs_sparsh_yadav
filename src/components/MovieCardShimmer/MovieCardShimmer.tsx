import React from 'react';
import './MovieCardShimmer.scss';
import Box from '@mui/material/Box';

const MovieCardShimmer: React.FC = () => {
    return (
        <Box className="netflix-show-card shimmer">
            <Box className="poster-container">
                <Box className="poster-image shimmer-placeholder"></Box>
                <Box className="crown-badge shimmer-placeholder"></Box>
            </Box>

            <Box className="show-info">
                <Box className="rating-container">
                    <Box className="rating-info">
                        <Box className="star-icon shimmer-placeholder"></Box>
                        <Box className="rating shimmer-placeholder"></Box>
                    </Box>
                    <Box className="bookmark-container shimmer-placeholder"></Box>
                </Box>

                <Box className="title-row">
                    <Box className="title shimmer-placeholder"></Box>
                </Box>

                <Box className="watch-options-btn shimmer-placeholder"></Box>

                {/* <Box className="action-buttons">
                    <Box className="watchlist-btn shimmer-placeholder"></Box>
                </Box> */}
            </Box>
        </Box>
    );
};

export default MovieCardShimmer;