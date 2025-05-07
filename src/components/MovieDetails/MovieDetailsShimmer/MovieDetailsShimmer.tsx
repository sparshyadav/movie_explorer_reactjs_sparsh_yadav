import React from 'react';
import './MovieDetailsShimmer.scss';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';

const MovieDetailsShimmer: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className="movie-page shimmer">
                <div className="banner">
                    <div className="banner__image shimmer-placeholder"></div>
                </div>

                <div className="container">
                    <div className="movie-content">
                        <div className="movie-content__poster">
                            <div className="poster-placeholder shimmer-placeholder"></div>
                        </div>

                        <div className="movie-content__details">
                            <div className="movie-header">
                                <div className="movie-header__title-group">
                                    <div className="title-placeholder shimmer-placeholder"></div>
                                    <div className="meta-placeholder shimmer-placeholder"></div>
                                </div>
                                <div className="watchlist-btn-placeholder shimmer-placeholder"></div>
                            </div>

                            <div className="genre-tags-placeholder shimmer-placeholder"></div>

                            <div className="rating-section">
                                <div className="rating-display">
                                    <div className="rating-badge-placeholder shimmer-placeholder"></div>
                                </div>
                                <div className="user-rating">
                                    <div className="rating-text-placeholder shimmer-placeholder"></div>
                                    <div className="star-rating-placeholder shimmer-placeholder"></div>
                                </div>
                            </div>

                            <div className="movie-description">
                                <div className="overview-title-placeholder shimmer-placeholder"></div>
                                <div className="description-placeholder shimmer-placeholder"></div>
                            </div>

                            <div className="credits-section">
                                <div className="credits-item">
                                    <div className="credits-title-placeholder shimmer-placeholder"></div>
                                    <div className="credits-text-placeholder shimmer-placeholder"></div>
                                </div>
                                <div className="credits-item">
                                    <div className="credits-title-placeholder shimmer-placeholder"></div>
                                    <div className="credits-text-placeholder shimmer-placeholder"></div>
                                </div>
                            </div>

                            <div className="streaming-section">
                                <div className="streaming-title-placeholder shimmer-placeholder"></div>
                                <div className="platform-list">
                                    <div className="movie-box">
                                        <div className="platform-logo-placeholder shimmer-placeholder"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MovieDetailsShimmer;