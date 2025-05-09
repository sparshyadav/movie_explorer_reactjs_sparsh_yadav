import { createContext, useState, useEffect, ReactNode } from "react";
import { getAllMoviesAPI } from "../API";

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

type MovieContextType = {
    movies: Movie[]; 
    setMovies: (movies: Movie[]) => void;
};

export const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider = ({ children }: { children: ReactNode }) => {
    const [movies, setMovies] = useState<Movie[]>([]); 

    return (
        <MovieContext.Provider value={{ movies, setMovies }}>
            {children}
        </MovieContext.Provider>
    );
};

export default MovieContext;
