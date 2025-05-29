import React, { useEffect, useState } from 'react';
import './CelebInfo.scss';
import MovieCard from '../CelebMovieCard/CelebMovieCard';
import { useParams } from 'react-router-dom';
import { getCelebByIdAPI } from '../../API';
import LinearProgress from '@mui/material/LinearProgress';

interface Movie {
  id: number;
  title: string;
  poster_url: string;
  release_year: number;
  rating: number;
}

interface CelebData {
  name: string;
  bannerImage: string;
  image_url: string;
  banner_url: string;
  biography: string;
  birth_date: string;
  age: number;
  nationality: string;
  role: string;
  movies: Movie[];
}

const CelebInfoPage: React.FC = () => {
  const { id } = useParams();
  const [celebData, setCelebData] = useState<CelebData | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCelebData = async () => {
      const response = await getCelebByIdAPI(String(id));
      console.log("RESULT: ", response);
      setCelebData(response);
    };

    fetchCelebData();
  }, [id]);

  if (!celebData) return (
    <div className="celeb-page">
      <LinearProgress />
    </div>
  )

  return (
    <div className="celeb-page">
      <div className="celeb-banner-section">
        <div
          className="celeb-banner-image"
          style={{ backgroundImage: `url(${celebData.banner_url})` }}
        >
          <div className="celeb-banner-overlay"></div>
        </div>
      </div>

      <div className="celeb-profile-section">
        <div className="celeb-container">
          <div className="celeb-profile-content">
            <div className="celeb-profile-image-container">
              <img
                src={celebData.image_url}
                alt={celebData.name}
                className="celeb-profile-image"
              />
            </div>
            <div className="celeb-profile-details">
              <h1 className="celeb-name">{celebData.name}</h1>
              <div className="celeb-roles">
                <span className="celeb-role-tag">{celebData.role}</span>
              </div>
              <div className="celeb-basic-info">
                <div className="celeb-info-item">
                  <span className="celeb-label">Born:</span>
                  <span className="celeb-value">{celebData.birth_date}</span>
                </div>
                <div className="celeb-info-item">
                  <span className="celeb-label">Age:</span>
                  <span className="celeb-value">{celebData.age}</span>
                </div>
                <div className="celeb-info-item">
                  <span className="celeb-label">Nationality:</span>
                  <span className="celeb-value">{celebData.nationality}</span>
                </div>
              </div>
              <div className="celeb-biography">
                <h3>Biography</h3>
                <p>{celebData.biography}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="celeb-movies-section">
        <div className="celeb-container">
          <h2 className="celeb-section-title">Filmography</h2>
          <div className="celeb-movies-list">
            {(celebData.movies ?? []).map((movie, index) => (
              <MovieCard
                key={`${movie.id}-${index}`}
                id={movie.id}
                title={movie.title}
                poster={movie.poster_url}
                releaseYear={movie.release_year}
                rating={movie.rating}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CelebInfoPage;
