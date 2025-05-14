export interface User {
  id: string | number;
  name: string;
  email: string;
  password: string;
  phone: string | number;
  address: string;
}

export type userLogin = Pick<User, 'email' | 'password'>
export type userCreate = Omit<User, 'id'>