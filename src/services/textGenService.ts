import axios from "axios";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/text-generator`;

const TextGeneratorService = {
    async extractJobData(jobDescription : any) {
        try {
            const response = await axios.post(`${baseUrl}`, jobDescription, {withCredentials: true})
            console.log(response.data)
            return response.data;
        } catch (error) {
            
        }
    }
}

export default TextGeneratorService;