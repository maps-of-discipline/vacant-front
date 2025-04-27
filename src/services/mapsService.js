import { mapsApi } from "./api";

export default class MapsService {
    static async getRups(aup1, aup2, sem) {
        const response = await mapsApi.post("/rups/get-rups-for-two-aups/v2", {
            aup1,
            aup2,
            sem_num: sem,
        });
        return response.data;
    }

    static async getProgramOptions() {
        const response = await mapsApi.get("/getAllMaps");
        return response.data;
    }


    static async fetchAllMaps() {
        const response = await mapsApi.get("/getAllMaps")
        return response.data
    }
}
