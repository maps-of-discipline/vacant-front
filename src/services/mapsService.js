import { mapsApi } from "./api";

export default class MapsService {
    static async getRups(aup1, aup2, sem) {
        const response = await mapsApi.get("/get-rups-for-two-aups", {
            params: {
                aup1,
                aup2,
                sem_num: sem,
            },
        });
        return response.data;
    }

    static async getProgramOptions() {
        const response = await mapsApi.get("/getAllMaps");
        return response.data;
    }
}