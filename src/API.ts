import axios from "axios";
import toast from "react-hot-toast";
import Cookies from 'js-cookie';

const BASE_URL = 'https://movie-explorer-ror-aalekh-2ewg.onrender.com';

export const loginAPI = async (payload: { email: string, password: string }) => {
    const { email, password } = payload;

    try {
        const response = await axios.post(`${BASE_URL}/users/sign_in`, { user: { email, password } },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );

        return response;
    }
    catch (error: { response: { data: { errors: string } } }) {
        console.log("Error Occurred while Signing In: ", error);
        toast.error(error?.response?.data?.errors);
    }
}

export const signupAPI = async (payload: { email: string, password: string, name: string, mobile_number: string }) => {
    const { email, password, name, mobile_number } = payload;

    try {
        const response = await axios.post(`${BASE_URL}/users`, { user: { email, password, name, mobile_number } },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );

        return response;
    }
    catch (error: { response: { data: { errors: string } } }) {
        console.log("Error Occurred while Signing Up: ", error);
        if (error?.response?.data?.errors.length > 1) {
            toast.error(error?.response?.data?.errors[0]);
        }
        else {
            toast.error(error?.response?.data?.errors);
        }
    }
}

export const getAllMoviesAPI = async (page: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/movies?page=${page}`);
        console.log("RESPONSE: ", response);

        return response.data;
    }
    catch (error: { response: { data: { errors: string } } }) {
        console.log("Error Occurred while Getting Movies: ", error);
        if (error?.response?.data?.errors.length > 1) {
            toast.error(error?.response?.data?.errors[0]);
        }
        else {
            toast.error(error?.response?.data?.errors);
        }
    }
}

export const getEveryMovieAPI = async () => {
    try {
        let allMovies: any[] = [];
        let currentPage = 1;
        let hasMorePages = true;

        while (hasMorePages) {
            const response = await axios.get(`${BASE_URL}/api/v1/movies?page=${currentPage}`);
            console.log(`Response from a single Page ${currentPage}: `, response);

            if (response?.data?.movies?.length === 10) {
                allMovies = [...allMovies, ...response.data.movies];
                currentPage++;
            }
            else if (response.data.movies.length < 10) {
                allMovies = [...allMovies, ...response.data.movies];
                hasMorePages = false;
            }
            else {
                hasMorePages = false;
            }

            if (currentPage > 100) {
                hasMorePages = false;
            }
        }

        console.log("THIS is ALL MOVIES: ", allMovies);

        return allMovies;
    }
    catch (error: { response: { data: { errors: string } } }) {
        console.log("Error Occurred while Getting Movies: ", error);
        if (error?.response?.data?.errors.length > 1) {
            toast.error(error?.response?.data?.errors[0]);
        }
        else {
            toast.error(error?.response?.data?.errors);
        }
        return [];
    }
}

export const addMovieAdminAPI = async (payload: {
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
}) => {
    try {
        const token = Cookies.get('authToken');
        console.log("TOKEN: ", token);
        const response = await axios.post(`${BASE_URL}/api/v1/movies`, payload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response;
    }
    catch (error: { response: { data: { errors: string } } }) {
        console.log("Error Occurred while Adding Movies via Admin: ", error);
        if (error?.response?.data?.errors.length > 1) {
            toast.error(error?.response?.data?.errors[0]);
        }
        else {
            toast.error(error?.response?.data?.errors);
        }
    }
}

export const movieDetailsAPI = async (id: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/movies/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log("Response from API: ", response);
        return response.data;
    }
    catch (error: { response: { data: { errors: string } } }) {
        console.log("Error Occurred Fetching Movie Details ", error);
        if (error?.response?.data?.errors.length > 1) {
            toast.error(error?.response?.data?.errors[0]);
        }
        else {
            toast.error(error?.response?.data?.errors);
        }
    }
}

export const getMoviesByGenre = async (genre: string, page: number = 1): Promise<any> => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/movies`, {
            params: {
                genre,
                page,
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const movieData = {
            movies: response.data.movies || [],
            pagination: response.data.pagination || {
                current_page: page,
                total_pages: 1,
                total_count: response.data.movies?.length || 0,
                per_page: 10,
            },
        };

        console.log(`Fetched movies for genre ${genre}, page ${page}:`, movieData);
        return movieData;
    } catch (error: any) {
        console.error(`Error fetching movies for genre ${genre}, page ${page}:`, error.message);
        return {
            movies: [],
            pagination: {
                current_page: page,
                total_pages: 1,
                total_count: 0,
                per_page: 10,
            },
        };
    }
};

export const searchMovieAPI = async (page: number = 1, title: string, genre?: string): Promise<any> => {
    const params: Record<string, any> = {
        title,
        page
    };

    if (genre && genre !== 'all') {
        params.genre = genre;
    }

    console.log("PARAMS: ", params);

    try {
        const response = await axios.get(`${BASE_URL}/api/v1/movies`, {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const movieData = {
            movies: response.data.movies || [],
            pagination: response.data.pagination || {
                current_page: page,
                total_pages: 1,
                total_count: response.data.movies?.length || 0,
                per_page: 10,
            },
        };

        console.log(`Fetched movies for genre ${genre}, page ${page}:`, movieData);
        return movieData;
    } catch (error: any) {
        console.error(`Error fetching movies for genre ${genre}, page ${page}:`, error.message);
        return {
            movies: [],
            pagination: {
                current_page: page,
                total_pages: 1,
                total_count: 0,
                per_page: 10,
            },
        };
    }
};

export const updateMovie = async (id: number, payload: {
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
}) => {
    try {
        const token = Cookies.get('authToken');
        console.log("Retrieved token:", token);

        if (!token) {
            toast.error("You need to sign in first.");
            throw new Error("No authentication token found");
        }

        const response = await axios.patch(`${BASE_URL}/api/v1/movies/${id}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            },
        });

        console.log("RESPONSE API: ", response);
        const movie = response.status;
        return movie;
    } catch (error: any) {
        console.error("Error updating movie:", error.message, error.response?.data);
        const errorMessage = error.response?.data?.error || "Failed to update movie";
        toast.error(errorMessage);
        return null;
    }
};

export const deleteMovie = async (id: number): Promise<boolean> => {
    try {
        const token = Cookies.get('authToken');
        console.log("Retrieved token:", token);
        if (!token) {
            toast.error("You need to sign in first.");
            throw new Error("No authentication token found");
        }

        await axios.delete(`${BASE_URL}/api/v1/movies/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        console.log(`Movie with ID ${id} deleted successfully`);
        toast.success("Movie deleted successfully!");
        return true;
    } catch (error: any) {
        console.error("Error deleting movie:", error.message, error.response?.data);
        const errorMessage = error.response?.data?.error || "Failed to delete movie";
        toast.error(errorMessage);
        return false;
    }
};



