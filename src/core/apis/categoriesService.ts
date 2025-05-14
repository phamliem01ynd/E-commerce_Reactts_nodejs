import { Category } from "../../models/Category";
import axios from "./axios_Customer";

export const getCategoriesAll = async () => {
  const api_url = "category";
  return axios.get<Category>(api_url);
}