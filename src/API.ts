import axios from "axios";

const BASE_URL = 'https://movie-explorer-ror-aalekh.onrender.com/api/v1';

export const loginAPI = async (payload: { email: string, password: string }) => {
    const { email, password } = payload;

    try {
        const response = await axios.post(`${BASE_URL}/auth/sign_in`, { user: {email, password} },
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
    catch (error) {
        console.log("Error Occurred while Signing In: ", error);
    }
}