import axios from "./AxiosConfig";

export const authenticateUser = async (username, password) => {
    try {
        const response = await axios.post('/auth/authenticate', {
            username,
            password,
        });
        return response;
    } catch (err) {
        throw err; // Propagate the error
    }
};