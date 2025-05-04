import axios from "axios";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/auth`;
console.log("Base URL:", import.meta.env.VITE_BASE_URL);

const LoginService = {
    async login(email: string, password: string) {
        try {
            const response = await axios.post(`${baseUrl}/login`, {
                email,
                password,
            }, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async googleLogin() {
        try {
            window.location.href = `${baseUrl}/google/login`;
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    },

    async signUp(displayName: string, email: string, password: string) {
        try {
            const response = await axios.post(`${baseUrl}/register`, { displayName, email, password }, { withCredentials: true });
            return response.data;
        } catch (error) {

        }
    },

    async getUserData() {
        try {
            const response = await axios.get(`${baseUrl}/user`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }
}

export default LoginService;