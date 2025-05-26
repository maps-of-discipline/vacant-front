const config = {
  vacant_api_base: import.meta.env.VITE_VACANT_API,
  admin_api_base: import.meta.env.VITE_ADMIN_API,
  admin_api_backend_base: import.meta.env.VITE_ADMIN_API_BACKED,
  maps_api_base: import.meta.env.VITE_MAPS_API,
  base_url: import.meta.env.VITE_BASE_URL,
  service_name: 'vacancy',

  getgeo_key: import.meta.env.VITE_GETGEO_KEY,
  getgeo_baseurl: 'https://api.gigdata.ru/api/v2',

  get semester1Start() {
    return new Date(new Date().getFullYear(), 1, 1);
  },
  get semester2Start() {
    return new Date(new Date().getFullYear(), 8, 1);
  },
};

export default config;
