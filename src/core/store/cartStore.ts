import create from "zustand";

interface cartItem {
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

interface cartState {
  cart: cartItem[];
  addToCart: (product: cartItem) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  reduceQuantity:(id: string | number, quantity: number) => void;
  deleteProduct: (id: string | number) => void;
  deleteAll: () => void;
}

export const useCartStore = create<cartState>((set, get) => ({
  cart:[],
  addToCart: (product) => {
    const currentCart = get().cart;
    const exist = currentCart.find((item) => item.id === product.id)
    if(!exist){
      set({ cart: [...currentCart, {...product, quantity: 1}]})
    }
  },

  updateQuantity: (id, quantity) => {
    const currentCart = get().cart;
    const exist = currentCart.map(item =>
      item.id === id ? { ...item, quantity: quantity + 1 } : item
    );
    if(exist){
      set({ cart: exist })
    }
  },
  reduceQuantity: (id, quantity) => {
    const currentCart = get().cart;
    const exist = currentCart.map(item => item.id === id ? {...item, quantity: quantity - 1} : item)
    if(exist){
      set({ cart: exist})
    }
  },

  deleteProduct: (id) => {
    const currentCart = get().cart;
    const exist = currentCart.filter(item => item.id !== id);
    set({ cart: [...exist]})
  },

  deleteAll:() => {
    set({ cart : []})
  }
}))