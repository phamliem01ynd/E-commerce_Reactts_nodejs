import axios from "axios";

export const getCountryAll = async () => {
  const api_url = 'https://provinces.open-api.vn/api/?depth=3';
  return axios.get(api_url);
}

export const gps = async (query : any) => {
  const api_url = `https://geocode.maps.co/search?q=${query}&api_key=68218f025f6fa644604974rsq40c2c3`;
  return axios.get(api_url);
}

export const geo = async (longitudeStart: any, latitudeStart: any, longitudeEnd: any, latitudeEnd: any) => {
  const api_url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248241716ba17de4bb0ab215bb14d3994f9&start=${longitudeStart},${latitudeStart}&end=${longitudeEnd},${latitudeEnd}`
  return axios.get(api_url);
}