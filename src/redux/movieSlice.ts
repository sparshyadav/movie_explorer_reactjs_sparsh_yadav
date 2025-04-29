import { getAllMoviesAPI } from "../API";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export type Movie = {
    title: string;
    genre: string;
    release_year: string;
    rating: string;
    director: string;
    duration: string;
    streaming_platform: string;
    main_lead: string;
    description: string;
    premium: boolean;
    poster: string;
    banner: string;
};

type MovieState = {
    movies: Movie[];
    loading: boolean;
    error: string | null;
}

const initialState: MovieState = {
    movies: [],
    loading: false,
    error: null
}

export const fetchMovies = createAsyncThunk('movies/fetchAll', async () => {
    const response = await getAllMoviesAPI();
    console.log("Response Inside Redux Slice: ", response);

    if (!response || !response.data) {
        throw new Error("Failed to fetch movies: No response or data");
    }

    return response.data.movies;
})

const movieSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {
        setMovies(state, action: PayloadAction<Movie[]>) {
            state.movies = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
                state.movies = action.payload;
                state.loading = true;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to Fetch Movies';
            })
    }
})

export const { setMovies } = movieSlice.actions;
export default movieSlice.reducer;


