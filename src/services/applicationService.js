import { api } from "./api.js";
import config from "../config.js";

export default class ApplicationService {
    static async updateApplication(data) {
        let application = this.unpackApplication(data)

        application.begin_year = new Date(application.begin_year).getFullYear();
        application.end_year = new Date(application.end_year).getFullYear();

        let response;
        switch (application.type) {
            case "change":
                response = await api.put("/applications/change", application);
                break;
            case "reinstatement":
                response = await api.put("/applications/reinstatement", application);
                break;
            case "transfer":
                response = await api.put("/applications/transfer", application);
                break;
            default:
                throw new Error(`Unknown application type: ${application.type}`);
        }
        return this.parseApplication(response.data);
    }

    static async saveApplication(data) {
        let application = this.unpackApplication(data)

        application.begin_year = new Date(application.begin_year).getFullYear();
        application.end_year = new Date(application.end_year).getFullYear();

        try {
            if (!application || !application.type) {
                throw new Error("Invalid application: missing type");
            }

            let response;

            switch (application.type) {
                case "change":
                    response = await api.post("/applications/change", application);
                    break;
                case "reinstatement":
                    response = await api.post("/applications/reinstatement", application);
                    break;
                case "transfer":
                    response = await api.post("/applications/transfer", application);
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

    static async fetchApplications() {
        const response = await api.get('/applications/all')
        return response.data
    }

    static async fetchUserApplications() {
        const response = await api.get("/applications/user");
        return response.data;
    }

    static async getApplication(id, type) {
        const response = await api.get(`/applications/${type}/${id}`);
        return this.parseApplication(response.data);
    }
    
    static async delete(id) {
        const application = await api.delete(`/applications/${id}`)
        return application
    }

    static async getCommnets(application_id, scope) {
        const response = await api.get(`/applications/comments`, { params: { application_id: application_id, scope: scope } })
        return response.data
    }

    static async addQuickComment(application_id, message_id) {
        const response = await api.post(`/applications/${application_id}/quickcomment`, { message_id: message_id })
        return response.data
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
                        acc[field] = new Date(application[field], 0, 1)
                    }
                    else
                        acc[field] = application[field];
                }
                return acc;
            }, {}),
            type: application.type,
        };

        return {
            id: application.id,
            user_id: application.user_id,
            type: application.type,
            date: application.date,
            status: application.status,
            header,
            footer,
            programs: application.programs || [],
        };
    }

    static unpackApplication(data) {
        return {
            id: data.id, 
            user_id: data.user_id,
            date: data.date,
            type: data.type,
            status: data.status,
            programs: data.programs,
            ...data.header,
            ...data.footer,
        }
    }

}

