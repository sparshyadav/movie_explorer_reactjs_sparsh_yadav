import React, { useState, useRef, useEffect } from 'react';
import { User, Camera, Calendar, Globe, UserCheck, Film, Search, X, ChevronDown, FileText } from 'lucide-react';
import './AddCelebrity.scss';
import { addCelebrityAPI, getEveryMovieAPI } from '../../API';
import toast from 'react-hot-toast';

interface Movie {
  id: number;
  title: string;
  poster_url: string;
  year: number;
}

interface CelebrityFormData {
  name: string;
  role: string;
  dateOfBirth: string;
  bio: string;
  nationality: string;
  profileImage: File | null;
  bannerImage: File | null;
  selectedMovies: Movie[];
}

const AddCelebrity: React.FC = () => {
  const [formData, setFormData] = useState<CelebrityFormData>({
    name: '',
    role: '',
    dateOfBirth: '',
    nationality: '',
    bio: '',
    profileImage: null,
    bannerImage: null,
    selectedMovies: []
  });

  const [profilePreview, setProfilePreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [movieSearchQuery, setMovieSearchQuery] = useState<string>('');
  const [movieSearchResults, setMovieSearchResults] = useState<Movie[]>([]);
  const [showMovieDropdown, setShowMovieDropdown] = useState<boolean>(false);
  const [isSearchingMovies, setIsSearchingMovies] = useState<boolean>(false);
  const movieSearchRef = useRef<HTMLDivElement>(null);
  const [mockMovies, setMockMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchAllMovies = async () => {
      let response = await getEveryMovieAPI();
      const movies = Array.isArray(response) ? response : response?.data || [];

      setMockMovies(movies);
    }

    fetchAllMovies();
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (movieSearchRef.current && !movieSearchRef.current.contains(event.target as Node)) {
        setShowMovieDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchMovies = (query: string) => {
    setIsSearchingMovies(true);
    setTimeout(() => {
      const filteredMovies = mockMovies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) &&
        !formData.selectedMovies.some(selected => selected.id === movie.id)
      );
      setMovieSearchResults(filteredMovies);
      setIsSearchingMovies(false);
      setShowMovieDropdown(true);
    }, 300);
  };

  const handleMovieSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setMovieSearchQuery(query);

    if (query.trim().length > 0) {
      searchMovies(query);
    } else {
      setMovieSearchResults([]);
      setShowMovieDropdown(false);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setFormData(prev => ({
      ...prev,
      selectedMovies: [...prev.selectedMovies, movie]
    }));
    setMovieSearchQuery('');
    setMovieSearchResults([]);
    setShowMovieDropdown(false);
  };

  const handleMovieRemove = (movieId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedMovies: prev.selectedMovies.filter(movie => movie.id !== movieId)
    }));
  };

  const roleOptions = [
    { value: '', label: 'Select Role' },
    { value: 'actor', label: 'Actor' },
    { value: 'director', label: 'Director' },
    { value: 'writer', label: 'Writer' }
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'profile' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (imageType === 'profile') {
          setProfilePreview(result);
          setFormData(prev => ({ ...prev, profileImage: file }));
        } else {
          setBannerPreview(result);
          setFormData(prev => ({ ...prev, bannerImage: file }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('celebrity[name]', formData.name);
    // data.append('role', formData.role);
    data.append('celebrity[birth_date]', formData.dateOfBirth);
    data.append('celebrity[nationality]', formData.nationality);
    data.append('celebrity[biography]', formData.bio);

    if (formData.profileImage) {
      data.append('celebrity[image]', formData.profileImage);
    }

    // if (formData.bannerImage) {
    //   data.append('bannerImage', formData.bannerImage);
    // }

    formData.selectedMovies.forEach((movie) => {
      data.append('celebrity[movie_ids][]', movie.id.toString());
    });

    try {
      const response = await addCelebrityAPI(data);
      console.log('Celebrity created:', response);
      toast.success('Celebrity added successfully!');
      handleReset();
    } catch (error) {
      console.error('Error adding celebrity:', error);
      toast.error('Failed to add celebrity.');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      role: '',
      dateOfBirth: '',
      nationality: '',
      bio: '',
      profileImage: null,
      bannerImage: null,
      selectedMovies: []
    });
    setProfilePreview('');
    setBannerPreview('');
    setMovieSearchQuery('');
    setMovieSearchResults([]);
    setShowMovieDropdown(false);
  };

  return (
    <div className="add-celebrity">
      <div className="add-celebrity__container">
        <div className="add-celebrity__header">
          <User className="add-celebrity__header-icon" />
          <h1 className="add-celebrity__title">Add New Celebrity</h1>
        </div>

        <div className="add-celebrity__form">
          <div className="add-celebrity__form-content">
            <div className="add-celebrity__form-fields">
              <div className="add-celebrity__field">
                <label htmlFor="name" className="add-celebrity__label">
                  <UserCheck size={18} />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="add-celebrity__input"
                  placeholder="Enter celebrity's full name"
                  required
                />
              </div>

              <div className="add-celebrity__field">
                <label htmlFor="role" className="add-celebrity__label">
                  <Camera size={18} />
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="add-celebrity__select"
                  required
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="add-celebrity__field">
                <label htmlFor="dateOfBirth" className="add-celebrity__label">
                  <Calendar size={18} />
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="add-celebrity__input"
                  required
                />
              </div>

              <div className="add-celebrity__field">
                <label htmlFor="nationality" className="add-celebrity__label">
                  <Globe size={18} />
                  Nationality
                </label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="add-celebrity__input"
                  placeholder="Enter nationality"
                  required
                />
              </div>

              <div className="add-celebrity__field">
                <label htmlFor="biography" className="add-celebrity__label">
                  <FileText size={18} />
                  Biography
                </label>
                <textarea
                  id="biography"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="add-celebrity__textarea"
                  placeholder="Enter celebrity's biography, achievements, and career highlights..."
                  rows={6}
                />
                <div className="add-celebrity__char-counter">
                  {formData.bio.length}/1000 characters
                </div>
              </div>

              <div className="add-celebrity__field">
                <label className="add-celebrity__label">
                  <Film size={18} />
                  Movies
                </label>
                <div className="add-celebrity__movie-search" ref={movieSearchRef}>
                  <div className="add-celebrity__search-container">
                    <Search size={20} className="add-celebrity__search-icon" />
                    <input
                      type="text"
                      value={movieSearchQuery}
                      onChange={handleMovieSearch}
                      className="add-celebrity__search-input"
                      placeholder="Search and select movies..."
                    />
                    {showMovieDropdown && (
                      <ChevronDown size={20} className="add-celebrity__dropdown-icon" />
                    )}
                  </div>

                  {showMovieDropdown && (
                    <div className="add-celebrity__movie-dropdown">
                      {isSearchingMovies ? (
                        <div className="add-celebrity__movie-loading">
                          <div className="add-celebrity__spinner"></div>
                          <span>Searching movies...</span>
                        </div>
                      ) : movieSearchResults.length > 0 ? (
                        movieSearchResults.map(movie => (
                          <div
                            key={movie.id}
                            className="add-celebrity__movie-option"
                            onClick={() => handleMovieSelect(movie)}
                          >
                            <img
                              src={movie.poster_url}
                              alt={movie.title}
                              className="add-celebrity__movie-poster"
                            />
                            <div className="add-celebrity__movie-details">
                              <span className="add-celebrity__movie-title">{movie.title}</span>
                              <span className="add-celebrity__movie-year">{movie.year}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="add-celebrity__no-results">
                          No movies found for "{movieSearchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {formData.selectedMovies.length > 0 && (
                  <div className="add-celebrity__selected-movies">
                    <div className="add-celebrity__movies-grid">
                      {formData.selectedMovies.map(movie => (
                        <div key={movie.id} className="add-celebrity__movie-chip">
                          <img
                            src={movie.poster_url}
                            alt={movie.title}
                            className="add-celebrity__chip-poster"
                          />
                          <div className="add-celebrity__chip-info">
                            <span className="add-celebrity__chip-title">{movie.title}</span>
                            <span className="add-celebrity__chip-year">{movie.year}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleMovieRemove(movie.id)}
                            className="add-celebrity__chip-remove"
                            aria-label={`Remove ${movie.title}`}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="add-celebrity__image-section">
              <div className="add-celebrity__image-field">
                <label className="add-celebrity__image-label">Profile Image</label>
                <div className="add-celebrity__image-upload">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'profile')}
                    className="add-celebrity__file-input"
                  />
                  <label htmlFor="profileImage" className="add-celebrity__file-label">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Profile preview"
                        className="add-celebrity__image-preview add-celebrity__image-preview--profile"
                      />
                    ) : (
                      <div className="add-celebrity__upload-placeholder">
                        <User size={40} />
                        <span>Click to upload profile image</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="add-celebrity__image-field">
                <label className="add-celebrity__image-label">Banner Image</label>
                <div className="add-celebrity__image-upload">
                  <input
                    type="file"
                    id="bannerImage"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'banner')}
                    className="add-celebrity__file-input"
                  />
                  <label htmlFor="bannerImage" className="add-celebrity__file-label">
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="add-celebrity__image-preview add-celebrity__image-preview--banner"
                      />
                    ) : (
                      <div className="add-celebrity__upload-placeholder add-celebrity__upload-placeholder--banner">
                        <Camera size={40} />
                        <span>Click to upload banner image</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="add-celebrity__actions">
            <button
              type="button"
              onClick={handleReset}
              className="add-celebrity__button add-celebrity__button--secondary"
            >
              Reset Form
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="add-celebrity__button add-celebrity__button--primary"
            >
              Add Celebrity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCelebrity;