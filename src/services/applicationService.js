import { api } from "./api.js";
import config from "../config.js";

export default class ApplicationService {
    static getUserApplications() {
        return api.get("applications/user");
    }

    static async saveApplication(data) {
        let application = {
            date: data.date,
            type: data.type,
            programs: data.programs,
            ...data.header,
            ...data.footer,
        };

        application.begin_year = new Date(application.begin_year).getFullYear();
        application.end_year = new Date(application.end_year).getFullYear();

        console.log("Saving application", application);
        try {
            if (!application || !application.type) {
                throw new Error("Invalid application: missing type");
            }

            let response;

            switch (application.type) {
                case "change":
                    response = await api.post("applications/change", application);
                    break;
                case "reinstatement":
                    response = await api.post("applications/reinstatement", application);
                    break;
                case "transfer":
                    response = await api.post("applications/transfer", application);
                    break;
                default:
                    throw new Error(`Unknown application type: ${application.type}`);
            }

            return response.data;
        } catch (error) {
            console.error("Request error:", error.message);
            throw error;
        }
    }

    static async fetchUserApplications() {
        try {
            const response = await api.get("/applications/applications");
            return response.data;
        } catch (error) {
            // Handle API errors
            if (error.response) {
                // The server responded with an error status
                console.error("Failed to fetch applications:", error.response.data);
                throw new Error(
                    error.response.data.message || "Failed to fetch applications",
                );
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received:", error.request);
                throw new Error("Server did not respond. Please try again later.");
            } else {
                // Something happened in setting up the request
                console.error("Request error:", error.message);
                throw error;
            }
        }
    }
    static async getApplication(id, type) {
        const response = await api.get(`/applications/${type}/${id}`);
        return this.parseApplication(response.data);
    }

    static parseApplication(application) {
        const footerFields = [
            "hostel_policy_accepted",
            "vacation_policy_viewed",
            "no_restrictions_policy_accepted",
            "reliable_information_policy_accepted",
            "paid_policy_accepted",
        ];

        const headerFieldsMap = {
            transfer: ["continue_year"],
            reinstatement: ["is_vacation_need", "begin_year", "end_year", "purpose"],
            change: ["purpose"],
        };

        const footer = {
            ...footerFields.reduce((acc, field) => {
                if (application[field] !== undefined) {
                    acc[field] = application[field];
                }
                return acc;
            }, {}),
            type: application.type,
        };

        const headerFields = headerFieldsMap[application.type] || [];
        const header = {
            ...headerFields.reduce((acc, field) => {
                if (application[field] !== undefined) {
                    if (field == "end_year" || field == "begin_year") {
                        acc[field] = new Date(application[field], 0, 1).toISOString()
                    }
                    else
                        acc[field] = application[field];
                }
                return acc;
            }, {}),
            type: application.type,
        };

        return {
            header,
            type: application.type,
            programs: application.programs || [],
            footer,
            date: application.date,
        };
    }
}
