import React from 'react';
import './CelebInfo.scss';
import MovieCard from '../CelebMovieCard/CelebMovieCard';

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
  profileImage: string;
  biography: string;
  birthDate: string;
  age: number;
  nationality: string;
  roles: string[];
  movies: Movie[];
}

const CelebInfoPage: React.FC = () => {
  const celebData: CelebData = {
    name: "Ryan Gosling",
    bannerImage: "https://www.hollywoodreporter.com/wp-content/uploads/2024/05/GettyImages-2150913647-copy.jpg",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    biography: "Ryan Thomas Gosling is a Canadian actor and musician. He began his career as a child actor on the Disney Channel's The Mickey Mouse Club and went on to appear in other family entertainment programs. As an adult, he has starred in both independent and major studio films spanning a variety of genres, from romantic comedies to dramas and thrillers.",
    birthDate: "November 12, 1980",
    age: 44,
    nationality: "Canadian",
    roles: ["Actor", "Producer", "Musician", "Director"],
        movies: [
      {
        id: 1,
        title: "La La Land",
        poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHmL6XTvAm6xYewfQq5i0OFN4dwC4VlXDWmQ&s",
        releaseYear: 2016,
        rating: 8.0
      },
      {
        id: 2,
        title: "Blade Runner 2049",
        poster: "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg",
        releaseYear: 2017,
        rating: 8.0
      },
      {
        id: 3,
        title: "The Notebook",
        poster: "https://www.tallengestore.com/cdn/shop/products/Drive-RyanGosling-HollywoodEnglishActionMovie2011Poster_c701af4b-9ed3-4daa-8c0b-fc76bfdec434.jpg?v=1617796632",
        releaseYear: 2004,
        rating: 7.8
      },
      {
        id: 4,
        title: "Drive",
        poster: "https://m.media-amazon.com/images/M/MV5BYjI3NDU0ZGYtYjA2YS00Y2RlLTgwZDAtYTE2YTM5ZjE1M2JlXkEyXkFqcGc@._V1_.jpg",
        releaseYear: 2011,
        rating: 7.8
      },
      {
        id: 5,
        title: "First Man",
        poster: "https://www.tallengestore.com/cdn/shop/products/Drive-RyanGosling-HollywoodEnglishActionMovie2011Poster_c701af4b-9ed3-4daa-8c0b-fc76bfdec434.jpg?v=1617796632",
        releaseYear: 2018,
        rating: 7.3
      },
      {
        id: 6,
        title: "Barbie",
        poster: "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg",
        releaseYear: 2023,
        rating: 6.9
      },
      {
        id: 1,
        title: "La La Land",
        poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHmL6XTvAm6xYewfQq5i0OFN4dwC4VlXDWmQ&s",
        releaseYear: 2016,
        rating: 8.0
      },
      {
        id: 2,
        title: "Blade Runner 2049",
        poster: "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg",
        releaseYear: 2017,
        rating: 8.0
      },
      {
        id: 3,
        title: "The Notebook",
        poster: "https://www.tallengestore.com/cdn/shop/products/Drive-RyanGosling-HollywoodEnglishActionMovie2011Poster_c701af4b-9ed3-4daa-8c0b-fc76bfdec434.jpg?v=1617796632",
        releaseYear: 2004,
        rating: 7.8
      },
      {
        id: 4,
        title: "Drive",
        poster: "https://m.media-amazon.com/images/M/MV5BYjI3NDU0ZGYtYjA2YS00Y2RlLTgwZDAtYTE2YTM5ZjE1M2JlXkEyXkFqcGc@._V1_.jpg",
        releaseYear: 2011,
        rating: 7.8
      },
      {
        id: 5,
        title: "First Man",
        poster: "https://www.tallengestore.com/cdn/shop/products/Drive-RyanGosling-HollywoodEnglishActionMovie2011Poster_c701af4b-9ed3-4daa-8c0b-fc76bfdec434.jpg?v=1617796632",
        releaseYear: 2018,
        rating: 7.3
      },
      {
        id: 6,
        title: "Barbie",
        poster: "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg",
        releaseYear: 2023,
        rating: 6.9
      }
    ]
  };

  return (
    <div className="celeb-page">
      <div className="banner-section">
        <div 
          className="banner-image" 
          style={{backgroundImage: `url(${celebData.bannerImage})`}}
        >
          <div className="banner-overlay"></div>
        </div>
      </div>

      <div className="profile-section">
        <div className="container">
          <div className="profile-content">
            <div className="profile-image-container">
              <img 
                src={celebData.profileImage} 
                alt={celebData.name} 
                className="profile-image" 
              />
            </div>
            <div className="profile-details">
              <h1 className="name">{celebData.name}</h1>
              <div className="roles">
                {celebData.roles.map((role, index) => (
                  <span key={index} className="role-tag">{role}</span>
                ))}
              </div>
              <div className="basic-info">
                <div className="info-item">
                  <span className="label">Born:</span>
                  <span className="value">{celebData.birthDate}</span>
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
            {celebData.movies.map((movie) => (
              <MovieCard
                key={movie.id}
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