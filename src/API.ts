import axios from "axios";
import toast from "react-hot-toast";
import Cookies from 'js-cookie';
import { TrySharp } from "@mui/icons-material";

const BASE_URL = 'https://movie-explorer-ror-aalekh-2ewg.onrender.com';

export const loginAPI = async (payload: { email: string, password: string }): Promise<any> => {
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
    catch (error: any) {
        console.log("Error Occurred while Signing In: ", error);
        toast.error(error?.response?.data?.error);
    }
}

export const signupAPI = async (payload: { email: string, password: string, name: string, mobile_number: string }): Promise<any> => {
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
    catch (error: any) {
        console.log("Error Occurred while Signing Up: ", error);
        if (error?.response?.data?.errors.length > 1) {
            toast.error(error?.response?.data?.errors[0]);
        }
        else {
            toast.error(error?.response?.data?.errors);
        }
    }
}

export const signoutAPI = async (): Promise<any> => {
    const authToken = Cookies.get('authToken');
    try {
        const response = await axios.delete(`${BASE_URL}/users/sign_out`,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );

        Cookies.remove('authToken');
        localStorage.removeItem('role');
        localStorage.removeItem('userPlan');

        return response;
    }
    catch (error: any) {
        console.log("Error Occurred while Signing In: ", error);
        toast.error(error?.response?.data?.error);
    }
}

export const getAllMoviesAPI = async (page: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/movies?page=${page}&per_page=10`);

        return response.data;
    }
    catch (error: any) {
        console.log("Error Occurred while Getting Movies: ", error);
        if (error?.response?.data?.errors.length > 1) {
            toast.error(error?.response?.data?.errors[0]);
        }
        else {
            toast.error(error?.response?.data?.errors);
        }
    }
}

export const getTopRatedMoviesAPI = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/movies?page=1&per_page=10&sort_by=rating&sort_direction=desc`);
        console.log("RESPONSE: ", response);
        return response.data;
    }
    catch (error: any) {
        console.log("Error Occurred while Getting Movies: ", error);
        if (error?.response?.data?.errors.length > 1) {
            toast.error(error?.response?.data?.errors[0]);
        }
        else {
            toast.error(error?.response?.data?.errors);
        }
    }
}

export const getLatestReleaseMoviesAPI = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/movies?page=1&per_page=10&sort_by=release_year&sort_direction=desc`);
        console.log("RESPONSE: ", response);
        return response.data;
    }
    catch (error: any) {
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
        const response = await axios.get(`${BASE_URL}/api/v1/movies?per_page=100`);
        return response.data.movies;
    }
    catch (error: any) {
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

export const addMovieAdminAPI = async (payload: FormData) => {
    try {
        const token = Cookies.get('authToken');
        const response = await axios.post(`${BASE_URL}/api/v1/movies`, payload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response;
    }
    catch (error: any) {
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
        const token = Cookies.get('authToken');

        const response = await axios.get(`${BASE_URL}/api/v1/movies/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    }
    catch (error: any) {
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

export const updateMovie = async (id: number, payload: FormData) => {
    try {
        const token = Cookies.get('authToken');

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

        toast.success("Movie deleted successfully!");
        return true;
    } catch (error: any) {
        console.error("Error deleting movie:", error.message, error.response?.data);
        const errorMessage = error.response?.data?.error || "Failed to delete movie";
        toast.error(errorMessage);
        return false;
    }
};

interface ApiErrorResponse {
    message?: string;
}

export const sendTokenToBackend = async (token: string): Promise<any> => {
    try {
        const authToken = Cookies.get('authToken');

        if (!authToken) {
            throw new Error('No authentication token found in user data.');
        }

        const response = await fetch('https://movie-explorer-ror-aalekh-2ewg.onrender.com/api/v1/update_device_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ device_token: token }),
        });

        if (!response.ok) {
            const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
            throw new Error(`Failed to send device token: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending device token to backend:', error);
        throw error;
    }
};

export const toggleNotifications = async () => {
    try {
        const authToken = Cookies.get('authToken');

        await axios.post('https://movie-explorer-ror-aalekh-2ewg.onrender.com/api/v1/toggle_notifications', {
            notifications_enabled: true
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            }
        });
    }
    catch (error) {
        console.error('Error Accepting Notifications:', error);
        throw error;
    }
}

export const createSubscription = async (planType: string): Promise<string> => {
    try {
        const token = Cookies.get('authToken');
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.post(
            `${BASE_URL}/api/v1/subscriptions`,
            { plan_type: planType },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data.error) {
            throw new Error(response.data.error);
        }

        const checkoutUrl = response.data.checkoutUrl || response.data.data?.checkoutUrl || response.data.url;
        if (!checkoutUrl) {
            throw new Error('No checkout URL returned from server.');
        }

        return checkoutUrl;
    } catch (error: any) {
        console.error('Error creating subscription:', error);
        throw new Error(error.message || 'Failed to initiate subscription');
    }
};

export const getSubscriptionStatus = async (token: string) => {
    try {
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(
            `${BASE_URL}/api/v1/subscriptions/status`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if ('error' in response.data) {
            throw new Error(response.data.error);
        }

        return response.data;
    } catch (error) {
        console.error('Subscription Status Error:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            response: axios.isAxiosError(error) ? error.response?.data : undefined,
            status: axios.isAxiosError(error) ? error.response?.status : undefined,
        });
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error || 'Failed to fetch subscription status');
        }
        throw new Error('An unexpected error occurred');
    }
};

export const verifySubscriptionStatusAPI = async (sessionId: string) => {
    try {
        const authToken = localStorage.getItem('token');
        const response = await axios.get(
            `${BASE_URL}/api/v1/subscriptions/success?session_id=${sessionId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        return response;
    } catch (err: any) {
        console.error('Error verifying subscription:', err);
    }
}

export const verifyCancellationStatusAPI = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/subscriptions/cancel`);
        return response;
    } catch (err: any) {
        console.error('Error verifying subscription:', err);
    }
}

export const getUserData = async () => {
    const token = Cookies.get("authToken");
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/current_user`, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    }
    catch (err: any) {
        console.error('Error verifying subscription:', err);
    }
}

export const addToWatchlist = async (movieId: number): Promise<any> => {
    try {
        const authToken = Cookies.get('authToken');
        if (!authToken) {
            throw new Error("Auth token not found in cookies.");
        }

        const response = await axios.post(
            `${BASE_URL}/api/v1/watchlists`,
            { movie_id: movieId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error("Error adding to watchlist:", error);
        throw error;
    }
};

export const removeFromWatchlist = async (movieId: number): Promise<any> => {
    try {
        const authToken = Cookies.get('authToken');
        if (!authToken) {
            throw new Error("Auth token not found in cookies.");
        }

        const response = await axios.delete(
            `${BASE_URL}/api/v1/watchlists/${movieId}`,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error("Error removing from watchlist:", error);
        throw error;
    }
};

export const getWatchlist = async (): Promise<any> => {
    try {
        const authToken = Cookies.get('authToken');
        if (!authToken) {
            throw new Error("Auth token not found in cookies.");
        }

        const response = await axios.get(`${BASE_URL}/api/v1/watchlists`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Accept': 'application/json'
            }
        });

        return response.data.data;

    } catch (error) {
        console.error("Error fetching watchlist:", error);
        throw error;
    }
};

export const getCelebsAPI = async (): Promise<any> => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/celebrities?page=1&per_page=10`);
        return response.data.data;
    }
    catch (error) {
        console.error("Error Fetching Celebrities:", error);
        throw error;
    }
}

export const getCelebByIdAPI = async (id: String): Promise<any> => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/celebrities/${id}`);
        console.log("RESPONSE: ", response);

        return response.data;
    }
    catch (error) {
        console.error("Error Fetching Celebrity by ID:", error);
        throw error;
    }
}

export const addCelebrityAPI = async(data: FormData) => {
    const token = Cookies.get('authToken');
    try {
        const response=await axios.post(`${BASE_URL}/api/v1/celebrities`, data, {
            headers: {
                'Accept': ' application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })

        console.log("RESPONSE OF ADD CELEB: ", response);
        return response;
    }
    catch (error) {
        console.error("Error Adding Celebrity:", error);
        throw error;
    }
};

export const deleteCelebAPI = async (id: String): Promise<any> => {
    const token = Cookies.get('authToken');
    try {
        const response = await axios.delete(`${BASE_URL}/api/v1/celebrities/${id}`, {
            headers: {
                'Accept': ' application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("RESPONSE: ", response);

        return response.data;
    }
    catch (error) {
        console.error("Error Fetching Celebrity by ID:", error);
        throw error;
    }
}

export const editCelebrityAPI = async(id: Number, data: FormData) => {
    const token = Cookies.get('authToken');
    try {
        const response=await axios.patch(`${BASE_URL}/api/v1/celebrities/${id}`, data, {
            headers: {
                'Accept': ' application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })

        console.log("API RESPONSE OF UPDATING: ", response);
        return response;
    }
    catch (error) {
        console.error("Error Updating Celebrity:", error);
        throw error;
    }
};
