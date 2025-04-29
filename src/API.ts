import axios from "axios";
import toast from "react-hot-toast";

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

        console.log("Response from API: ", response);
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

        console.log("Response from API: ", response);
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

export const getAllMoviesAPI = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/movies`);

        console.log("Response from API: ", response);
        return response;
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