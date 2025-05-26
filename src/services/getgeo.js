import { getgeo_api } from './api';

export default class GetGeoService {
  static async makeRequest(endpoint, query, count) {
    const response = await getgeo_api.post(endpoint, {
      query: query,
      count: count,
    });
    return response.data;
  }
  static async educations(query, count = 5) {
    return await GetGeoService.makeRequest('/suggest/educations', query, count);
  }

  static async passports(query, count = 5) {
    return await GetGeoService.makeRequest('/suggest/passports', query, count);
  }

  static async address(query, count = 5) {
    return await GetGeoService.makeRequest('/suggest/address', query, count);
  }
}
