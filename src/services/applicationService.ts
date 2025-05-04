import axios from "axios";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/application`;

const ApplicationService = {
    async getApplications() {
        try {
            const response = await axios.get(`${baseUrl}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error("Error getting applications:", error);
            throw error;
        }

    },
    async updateApplication(applicationId: string, applicationData: any) {
        try {
            const response = await axios.patch(`${baseUrl}/${applicationId}`, applicationData, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error("Error updating application:", error);
            throw error;
        }
    },
    async deleteApplication(applicationId: string) {
        try {
            const response = await axios.delete(`${baseUrl}/${applicationId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error("Error deleting application:", error);
            throw error;
        }
    },

    async createApplication(applicationData: any) {
        try {
            const response = await axios.post(`${baseUrl}`, applicationData, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error("Error Inserting application:", error);
            throw error;
        }
    },
}

export default ApplicationService;