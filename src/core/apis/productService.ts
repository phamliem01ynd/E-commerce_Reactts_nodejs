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

export const editProduct = async (id: number, data: Product) => {
  const api_url = `/product/update/${id}`;
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value as any)
  })
  return axios.put<Product>(api_url, formData)
}

export const deleteProduct = async ( id: string | number ) => {
  const api_url =`/product/delete/${id}`;
  return axios.post(api_url);
}

export const createProduct = async (data: Product) => {
  const api_url = "product/create-with-image";
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })

  return axios.post(api_url, formData, {
    headers:{
      'Content-Type': 'multipart/form-data'
    }
  })
}