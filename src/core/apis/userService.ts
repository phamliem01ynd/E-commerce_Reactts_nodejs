import { User } from "../../models/User";
import axios from "./axios_Customer";

export const getAllUser = async () => {
  try {
    const api_url = 'user';
    return axios.get(api_url);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export const login = async (user: User) => {
  try {
    const api_url = 'user/login';
    return axios.post(api_url, user)
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export const registerUser = async (user: User) => {
  try {
    const api_url = 'user/register';
    return axios.post(api_url, user)
  } catch (error) {
    console.error('Error register in:', error);
    throw error;
  }
}