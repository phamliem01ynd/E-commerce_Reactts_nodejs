import { Product } from "../../models/Product";
import axios from "./axios_Customer";

export const getProductAll = async () => {
  const api_url = "product";
  return axios.get(api_url);
}

export const searchProduct = async (search : string | null) => {
  const api_url = "product/searchProduct";
  return axios.get<Product>(api_url, {
    params: {search}
  });
}

export const editProduct = async (formData : FormData) => {
  const api_url = `/product/update/${id}`;
  return axios.put<Product>(api_url, formData)
}

export const deleteProduct = async ( id: string | number ) => {
  const api_url =`/product/delete/${id}`;
  return axios.post(api_url);
}

export const createProduct = async (formData: FormData) => {
  const api_url = "product/create-with-image";
  return axios.post(api_url, formData)
}

export const getProductById = async (id : string | number) => {
  const api_url =`/product/findbyid/${id}`;
  return axios.get<Product>(api_url);
}