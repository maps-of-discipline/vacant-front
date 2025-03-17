import {api} from "./api.js";
import config from "../config.js";


export default class ApplicationService {
    static getUserApplications() {
        return api.get('applications/user');
    }

    static async saveApplication(application) {
        console.log("Saving application", application);
        try {
            // Check if we have a valid application type
            if (!application || !application.type) {
                throw new Error('Invalid application: missing type');
            }

            let response;
            
            // Use the appropriate endpoint based on application type
            switch (application.type) {
                case 'change':
                    response = await api.post('applications/change', application);
                    break;
                case 'reinstatement':
                    response = await api.post('applications/reinstatement', application);
                    break;
                case 'transfer':
                    response = await api.post('applications/transfer', application);
                    break;
                default:
                    throw new Error(`Unknown application type: ${application.type}`);
            }
            
            return response.data;
        } catch (error) {
            // Handle API errors
            if (error.response) {
                // The server responded with an error status
                console.error('Application submission failed:', error.response.data);
                throw new Error(error.response.data.message || 'Failed to submit application');
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                throw new Error('Server did not respond. Please try again later.');
            } else {
                // Something happened in setting up the request
                console.error('Request error:', error.message);
                throw error;
            }
        }
    }

    static async fetchUserApplications() {
        try {
            const response = await api.get('/applications/applications');
            return response.data;
        } catch (error) {
            // Handle API errors
            if (error.response) {
                // The server responded with an error status
                console.error('Failed to fetch applications:', error.response.data);
                throw new Error(error.response.data.message || 'Failed to fetch applications');
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                throw new Error('Server did not respond. Please try again later.');
            } else {
                // Something happened in setting up the request
                console.error('Request error:', error.message);
                throw error;
            }
        }
    }
}
