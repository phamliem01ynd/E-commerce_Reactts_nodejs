
import { z } from "zod";
import { isDiscount, isPrice, isQuantity } from "./validator";

export const ProductSchema = z.object({
  name: z.string()
    .min(6, { message : 'Độ dài tối thiểu là 6 ký tự'})
    .max(32, { message : 'Độ dài tối đa là 32 ký tự'}),
  discount: z.number()
    .refine(isDiscount, {message: 'Discount nằm trong khoảng từ 0 - 100'}),
  quantity: z.number()
    .refine(isQuantity, { message: 'Số lượng tối đa có thể nhập là 100000'}),
  price: z.number()
  .refine(isPrice, { message: 'Giá tối đa có thể nhập là 1000000000'}),
  description: z.string()
    .min(6, { message : 'Độ dài tối thiểu là 6 ký tự'})
    .max(250, { message : 'Độ dài tối đa là 250 ký tự'}),
  
})

export type ProductFormInput = z.infer<typeof ProductSchema>;