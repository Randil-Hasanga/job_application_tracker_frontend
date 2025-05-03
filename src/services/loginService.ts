import axios from "axios";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/auth`;

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
    }
}

export default LoginService;