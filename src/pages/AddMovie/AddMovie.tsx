import React, { Component, ChangeEvent } from 'react';
import {
    Box, TextField, Button, Typography, FormControl, FormControlLabel, Checkbox, FormGroup, FormLabel, Paper, SelectChangeEvent, Snackbar, Alert
} from '@mui/material';
import './AddMovie.scss';
import { addMovieAdminAPI } from '../../API';

interface MovieFormState {
    title: string;
    genre: string;
    release_year: string;
    rating: string;
    director: string;
    duration: string;
    main_lead: string;
    streaming_platform: string;
    description: string;
    poster: File | null;
    banner: File | null;
    isPremiumElite: boolean;
    isPremiumPro: boolean;
    isPremiumFree: boolean;
    posterPreview: string;
    bannerPreview: string;
    isSubmitting: boolean;
    submitSuccess: boolean;
    submitError: boolean;
}

class AddMovie extends Component<object, MovieFormState> {
    constructor(props: object) {
        super(props);
        this.state = {
            title: '',
            genre: '',
            release_year: '',
            rating: '',
            director: '',
            duration: '',
            main_lead: '',
            streaming_platform: '',
            poster: null,
            banner: null,
            description: '',
            isPremiumElite: false,
            isPremiumPro: false,
            isPremiumFree: true,
            posterPreview: '',
            bannerPreview: '',
            isSubmitting: false,
            submitSuccess: false,
            submitError: false
        };
    }

    handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        this.setState({ ...this.state, [name]: value });
    }

    handleSelectChange = (e: SelectChangeEvent) => {
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

        try {
            const payload = {
                title: this.state.title,
                genre: this.state.genre,
                release_year: this.state.release_year,
                rating: this.state.rating,
                director: this.state.director,
                duration: this.state.duration,
                streaming_platform: this.state.streaming_platform,
                description: this.state.description,
                main_lead: this.state.main_lead,
                poster: this.state.poster,
                banner: this.state.banner,
            };

            const response = await addMovieAdminAPI(payload);
            console.log("RESPONSE IN AMDIN PANEL: ", response);

            this.setState({
                isSubmitting: false,
                submitSuccess: true,
                title: '',
                genre: '',
                release_year: '',
                rating: '',
                director: '',
                duration: '',
                streaming_platform: '',
                description: '',
                main_lead: '',
                poster: null,
                banner: null,
                isPremiumElite: false,
                isPremiumPro: false,
                isPremiumFree: true
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

    render() {
        const {
            title, genre, release_year, rating, director, duration,
            isPremiumElite, isPremiumPro, isPremiumFree, streaming_platform, main_lead,
            description,
            posterPreview, bannerPreview, isSubmitting,
            submitSuccess, submitError
        } = this.state;

        return (
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
                                        type="text"
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
                                                checked={isPremiumElite}
                                                onChange={this.handleCheckboxChange}
                                                name="isPremiumElite"
                                                className="premium-checkbox elite"
                                            />
                                        }
                                        label="Elite"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isPremiumPro}
                                                onChange={this.handleCheckboxChange}
                                                name="isPremiumPro"
                                                className="premium-checkbox pro"
                                            />
                                        }
                                        label="Pro"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isPremiumFree}
                                                onChange={this.handleCheckboxChange}
                                                name="isPremiumFree"
                                                className="premium-checkbox free"
                                            />
                                        }
                                        label="Free"
                                    />
                                </FormGroup>
                            </FormControl>
                        </Box>

                        <Box className="form-actions">
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
                            >
                                Cancel
                            </Button>
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
        );
    }
}

export default AddMovie;