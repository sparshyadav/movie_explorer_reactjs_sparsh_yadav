import React, { useEffect, useState } from 'react';
import './CelebInfo.scss';
import MovieCard from '../CelebMovieCard/CelebMovieCard';
import { useParams } from 'react-router-dom';
import { getCelebByIdAPI } from '../../API';

interface Movie {
  id: number;
  title: string;
  poster: string;
  releaseYear: number;
  rating: number;
}

interface CelebData {
  name: string;
  bannerImage: string;
  image_url: string;
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
    const fetchCelebData = async () => {
      const response = await getCelebByIdAPI(String(id));
      console.log("RESULT: ", response);
      setCelebData(response);
    };

    fetchCelebData();
  }, [id]);

  if (!celebData) return <div>Loading...</div>;

  return (
    <div className="celeb-page">
      <div className="banner-section">
        <div
          className="banner-image"
          style={{ backgroundImage: `url(${celebData.image_url})` }}
        >
          <div className="banner-overlay"></div>
        </div>
      </div>

      <div className="profile-section">
        <div className="container">
          <div className="profile-content">
            <div className="profile-image-container">
              <img
                src={celebData.image_url}
                alt={celebData.name}
                className="profile-image"
              />
            </div>
            <div className="profile-details">
              <h1 className="name">{celebData.name}</h1>
              <div className="roles">
                <span className="role-tag">{celebData.role}</span>
              </div>
              <div className="basic-info">
                <div className="info-item">
                  <span className="label">Born:</span>
                  <span className="value">{celebData.birth_date}</span>
                </div>
                <div className="info-item">
                  <span className="label">Age:</span>
                  <span className="value">{celebData.age}</span>
                </div>
                <div className="info-item">
                  <span className="label">Nationality:</span>
                  <span className="value">{celebData.nationality}</span>
                </div>
              </div>
              <div className="biography">
                <h3>Biography</h3>
                <p>{celebData.biography}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="movies-section">
        <div className="container">
          <h2 className="section-title">Filmography</h2>
          <div className="movies-list">
            {(celebData.movies ?? []).map((movie, index) => (
              <MovieCard
                key={`${movie.id}-${index}`}
                id={movie.id}
                title={movie.title}
                poster={movie.poster}
                releaseYear={movie.releaseYear}
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
