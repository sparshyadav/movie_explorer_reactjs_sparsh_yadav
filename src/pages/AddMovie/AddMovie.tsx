import React, { Component, ChangeEvent } from 'react';
import {
    Box, TextField, Button, Typography, FormControl, FormControlLabel, Checkbox, FormGroup, FormLabel, Paper, SelectChangeEvent, Snackbar, Alert
} from '@mui/material';
import './AddMovie.scss';
import { addMovieAdminAPI, deleteMovie, movieDetailsAPI, updateMovie } from '../../API';
import Navbar from '../../components/Navbar/Navbar';
import AddMovieWrapper from '../../components/AddMovieWrapper';

interface MovieFormState {
    id?: number;
    title: string;
    genre: string;
    release_year: string;
    rating: string;
    director: string;
    duration: number;
    main_lead: string;
    streaming_platform: string;
    description: string;
    poster: File | null;
    banner: File | null;
    premium: boolean,
    posterPreview: string;
    bannerPreview: string;
    isSubmitting: boolean;
    isEditing: boolean;
    submitSuccess: boolean;
    submitEdit: boolean;
    submitError: boolean;
    isDeleting: boolean;
}

interface AddMovieProps {
    id?: string;
    navigate: (path:string) => void;
}


class AddMovie extends Component<AddMovieProps, MovieFormState> {
    constructor(props: AddMovieProps) {
        super(props);
        this.state = {
            title: '',
            genre: '',
            release_year: '',
            rating: '',
            director: '',
            duration: 0,
            main_lead: '',
            streaming_platform: '',
            poster: null,
            banner: null,
            description: '',
            premium: false,
            posterPreview: '',
            bannerPreview: '',
            isSubmitting: false,
            isEditing: false,
            submitSuccess: false,
            submitEdit: false,
            submitError: false,
            isDeleting: false
        };
    }

    handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        this.setState({ ...this.state, [name]: value });
    }

    handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        this.setState({ ...this.state, [name]: checked });
    }

    handleFileChange = (e: ChangeEvent<HTMLInputElement>, fileType: 'poster' | 'banner') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                if (fileType === 'poster') {
                    this.setState({
                        poster: file,
                        posterPreview: reader.result as string
                    });
                } else {
                    this.setState({
                        banner: file,
                        bannerPreview: reader.result as string
                    });
                }
            };

            reader.readAsDataURL(file);
        }
    }

    handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        this.setState({ isSubmitting: true });

        const payload = new FormData();
        payload.append("movie[title]", this.state.title);
        payload.append("movie[genre]", this.state.genre);
        payload.append("movie[release_year]", this.state.release_year);
        payload.append("movie[director]", this.state.director);
        payload.append("movie[duration]", String(this.state.duration));
        payload.append("movie[description]", this.state.description);
        payload.append("movie[main_lead]", this.state.main_lead);
        payload.append("movie[streaming_platform]", this.state.streaming_platform);
        payload.append("movie[rating]", this.state.rating);
        payload.append("movie[premium]", String(this.state.premium))

        if (this.state.poster) {
            payload.append("movie[poster]", this.state.poster);
          }
          if (this.state.banner) {
            payload.append("movie[banner]", this.state.banner);
          }


        try {
            await addMovieAdminAPI(payload);

            this.setState({
                isSubmitting: false,
                submitSuccess: true,
                title: '',
                genre: '',
                release_year: '',
                rating: '',
                director: '',
                duration: 0,
                streaming_platform: '',
                description: '',
                main_lead: '',
                poster: null,
                banner: null,
                premium: false,
                posterPreview: '',
                bannerPreview: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            this.setState({
                isSubmitting: false,
                submitError: true
            });
        }
    }

    handleCloseSnackbar = () => {
        this.setState({
            submitSuccess: false,
            submitError: false
        });
    }

    componentDidMount(): void {
        const { id } = this.props;

        if (id !== undefined) {
            const fetchMovieDetails = async () => {
                if (!id) return;
                try {
                    const response = await movieDetailsAPI(Number(id));

                    this.setState({
                        title: response.title,
                        genre: response.genre,
                        release_year: response.release_year,
                        rating: response.rating,
                        director: response.director,
                        duration: response.duration,
                        main_lead: response.main_lead,
                        streaming_platform: response.streaming_platform,
                        poster: response.poster_url,
                        banner: response.banner_url,
                        description: response.description,
                        premium: response.premium,
                        posterPreview: response.poster_url,
                        bannerPreview: response.banner_url,
                    })
                } catch (error) {
                    console.error("Error fetching movie details:", error);
                }
            };

            fetchMovieDetails();
        }
    }

    handleEdit = async () => {
        this.setState({ isSubmitting: true });

        const payload = new FormData();
        payload.append("movie[title]", this.state.title);
        payload.append("movie[genre]", this.state.genre);
        payload.append("movie[release_year]", this.state.release_year);
        payload.append("movie[director]", this.state.director);
        payload.append("movie[duration]", String(this.state.duration));
        payload.append("movie[description]", this.state.description);
        payload.append("movie[main_lead]", this.state.main_lead);
        payload.append("movie[streaming_platform]", this.state.streaming_platform);
        payload.append("movie[rating]", this.state.rating);
        payload.append("movie[premium]", String(this.state.premium))

        if (this.state.poster) {
            payload.append("movie[poster]", this.state.poster);
          }
          if (this.state.banner) {
            payload.append("movie[banner]", this.state.banner);
          }

        try {
            const { id } = this.props;
            if(!id) return;
            await updateMovie(Number(id), payload);

            this.props.navigate('/');

            this.setState({
                isSubmitting: false,
                submitSuccess: false,
                isEditing: false,
                submitEdit: true,
                title: '',
                genre: '',
                release_year: '',
                rating: '',
                director: '',
                duration: 0,
                streaming_platform: '',
                description: '',
                main_lead: '',
                poster: null,
                banner: null,
                premium: false,
                posterPreview: '',
                bannerPreview: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            this.setState({
                isSubmitting: false,
                submitError: true
            });
        }
    }

    handleDelete = async () => {
        this.setState({ isDeleting: true });

        const { id } = this.props;
        await deleteMovie(Number(id));

        this.props.navigate('/');

        this.setState({ isDeleting: false });
        
    }

    render() {
        const {
            title, genre, release_year, rating, director, duration,
            premium, streaming_platform, main_lead,
            description, submitEdit, isDeleting,
            posterPreview, bannerPreview, isSubmitting,
            submitSuccess, submitError
        } = this.state;

        return (
            <>
                <Navbar />
                <div className="admin-movie-page">
                    <Paper elevation={3} className="form-container">
                        <Typography variant="h4" className="form-title">
                            Add New Movie
                        </Typography>

                        <form onSubmit={this.handleSubmit}>
                            <Box className="form-section">
                                <Typography variant="h6" className="section-title">
                                    Movie Details
                                </Typography>

                                <Box className="form-row">
                                    <TextField
                                        label="Movie Title"
                                        name="title"
                                        value={title}
                                        onChange={this.handleTextChange}
                                        fullWidth
                                        required
                                        className="form-field"
                                    />
                                </Box>
                                <Box className="form-row">
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={description}
                                        onChange={this.handleTextChange}
                                        fullWidth
                                        required
                                        className="form-field"
                                    />
                                </Box>
                                <Box className="form-row two-columns">
                                    <FormControl fullWidth className="form-field">
                                        <TextField
                                            label="Genre"
                                            name="genre"
                                            value={genre}
                                            onChange={this.handleTextChange}
                                            fullWidth
                                            required
                                            className="form-field"
                                        />
                                    </FormControl>
                                    <FormControl fullWidth className="form-field">
                                        <TextField
                                            label="Release Year"
                                            name="release_year"
                                            value={release_year}
                                            onChange={this.handleTextChange}
                                            type="text"
                                            required
                                            className="form-field"
                                        />
                                    </FormControl>
                                </Box>
                                <Box className="form-row two-columns">
                                    <FormControl fullWidth className="form-field">
                                        <TextField
                                            label="Rating"
                                            name="rating"
                                            value={rating}
                                            onChange={this.handleTextChange}
                                            fullWidth
                                            required
                                            className="form-field"
                                        />
                                    </FormControl>
                                    <FormControl fullWidth className="form-field">
                                        <TextField
                                            label="Duration (minutes)"
                                            name="duration"
                                            value={duration}
                                            onChange={this.handleTextChange}
                                            type="number"
                                            required
                                            className="form-field"
                                        />
                                    </FormControl>
                                </Box>
                                <Box className="form-row two-columns">
                                    <FormControl fullWidth className="form-field">
                                        <TextField
                                            label="Director"
                                            name="director"
                                            value={director}
                                            onChange={this.handleTextChange}
                                            fullWidth
                                            required
                                            className="form-field"
                                        />
                                    </FormControl>
                                    <FormControl fullWidth className="form-field">
                                        <TextField
                                            label="Main Lead"
                                            name="main_lead"
                                            value={main_lead}
                                            onChange={this.handleTextChange}
                                            type="text"
                                            required
                                            className="form-field"
                                        />
                                    </FormControl>
                                </Box>
                                <Box className="form-row">
                                    <TextField
                                        label="Streaming Platform"
                                        name="streaming_platform"
                                        value={streaming_platform}
                                        onChange={this.handleTextChange}
                                        fullWidth
                                        required
                                        className="form-field"
                                    />
                                </Box>
                            </Box>

                            <Box className="form-section">
                                <Typography variant="h6" className="section-title">
                                    Media Files
                                </Typography>

                                <Box className="form-row two-columns">
                                    <Box className="file-upload-container">
                                        <Typography variant="subtitle1">Movie Poster</Typography>
                                        <input
                                            accept="image/*"
                                            id="poster-upload"
                                            type="file"
                                            onChange={(e) => this.handleFileChange(e, 'poster')}
                                            className="file-input"
                                        />
                                        <label htmlFor="poster-upload">
                                            <Button
                                                variant="contained"
                                                component="span"
                                                className="upload-button"
                                            >
                                                Upload Poster
                                            </Button>
                                        </label>
                                        {posterPreview && (
                                            <Box className="preview-container">
                                                <img src={posterPreview} alt="Poster preview" className="image-preview" />
                                            </Box>
                                        )}
                                    </Box>

                                    <Box className="file-upload-container">
                                        <Typography variant="subtitle1">Banner Image</Typography>
                                        <input
                                            accept="image/*"
                                            id="banner-upload"
                                            type="file"
                                            onChange={(e) => this.handleFileChange(e, 'banner')}
                                            className="file-input"
                                        />
                                        <label htmlFor="banner-upload">
                                            <Button
                                                variant="contained"
                                                component="span"
                                                className="upload-button"
                                            >
                                                Upload Banner
                                            </Button>
                                        </label>
                                        {bannerPreview && (
                                            <Box className="preview-container">
                                                <img src={bannerPreview} alt="Banner preview" className="image-preview banner-preview" />
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>

                            <Box className="form-section">
                                <FormControl component="fieldset" className="premium-options">
                                    <FormLabel component="legend" className="premium-label">Premium Options</FormLabel>
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={premium}
                                                    onChange={this.handleCheckboxChange}
                                                    name="premium"
                                                    className="premium-checkbox pro"
                                                />
                                            }
                                            label="Pro"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </Box>

                            <Box className="form-actions">
                                {this.props.id ? (
                                    <>
                                        <Button
                                            type="button"
                                            variant="contained"
                                            size="large"
                                            className="submit-button"
                                            disabled={isSubmitting}
                                            onClick={this.handleEdit}
                                        >
                                            {isSubmitting ? 'Editing...' : 'Edit Movie'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            size="large"
                                            className="cancel-button"
                                            color="error"
                                            onClick={this.handleDelete}
                                        >
                                            {isDeleting ? 'Deleting...' : 'Delete Movie'}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            className="submit-button"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Add Movie'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            size="large"
                                            className="cancel-button"
                                            onClick={() => window.history.back()}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </Box>

                        </form>
                    </Paper>

                    <Snackbar
                        open={submitSuccess}
                        autoHideDuration={6000}
                        onClose={this.handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert onClose={this.handleCloseSnackbar} severity="success">
                            Movie added successfully!
                        </Alert>
                    </Snackbar>

                    <Snackbar
                        open={submitEdit}
                        autoHideDuration={6000}
                        onClose={this.handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert onClose={this.handleCloseSnackbar} severity="success">
                            Movie edited successfully!
                        </Alert>
                    </Snackbar>

                    <Snackbar
                        open={submitError}
                        autoHideDuration={6000}
                        onClose={this.handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert onClose={this.handleCloseSnackbar} severity="error">
                            Failed to add movie. Please try again.
                        </Alert>
                    </Snackbar>
                </div>
            </>
        );
    }
}

export default AddMovieWrapper(AddMovie);