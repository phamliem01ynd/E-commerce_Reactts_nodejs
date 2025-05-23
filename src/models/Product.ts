
export interface Product{
  id: string | number;
  name: string;
  image: string;
  quantity: number;
  price: number;
  description: string;
  category_id: string | number;
  status: boolean;
  sold: number;
  discount: number
}

export type ProductHome = Omit<Product, 'status'>
export type CreateProduct = Omit<Product, 'id' | 'status'>;
