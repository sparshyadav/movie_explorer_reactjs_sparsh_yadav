import React from 'react';
import './CelebMovieCard.scss';
import { NavLink } from 'react-router-dom';

interface MovieCardProps {
  id: number;
  title: string;
  poster: string;
  releaseYear: number;
  rating: number;
}

const CelebMovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  poster,
  releaseYear,
  rating
}) => {
  return (
    <NavLink to={`/movie-details/${id}`}>
      <div className="movie-card">
        <div className="movie-poster">
          <img src={poster} alt={title} />
        </div>
        <div className="movie-info">
          <h3 className="movie-title">{title}</h3>
          <div className="movie-year">{releaseYear}</div>
          <div className="movie-rating">
            <span className="rating-icon">★</span>
            <span className="rating-value">{rating}</span>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default CelebMovieCard;