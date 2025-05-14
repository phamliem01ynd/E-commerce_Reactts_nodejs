import { z } from 'zod';
import { isValidEmail, noWhiteSpace } from './validator';

export const LoginSchema = z.object ({
  email: z.string()
    .min(3, { message : 'Độ dài tối thiểu phải 3 ký tự'})
    .max(36, { message : 'Độ dài tối đa là 20 ký tự'})
    .refine( noWhiteSpace, {message: 'Không được có khoảng trắng giữa các ký tự'})
    .refine( isValidEmail, {message: 'Phải có định dạng email!'}),

  password: z.string()
    .min(3, { message : 'Độ dài tối thiểu phải 3 ký tự'})
    .max(20, { message : 'Độ dài tối đa là 20 ký tự'})
    .refine( noWhiteSpace, {message: 'Không được có khoảng trắng giữa các ký tự'}),
});

export const RegisterSchema = LoginSchema.extend({
  confirmPassword: z.string()
    .min(3, { message : 'Độ dài tối thiểu phải 3 ký tự'})
    .max(20, { message : 'Độ dài tối đa là 20 ký tự'})
    .refine( noWhiteSpace, {message: 'Không được có khoảng trắng giữa các ký tự'})
}).refine((data) => data.password === data.confirmPassword, {
  path:['confirmPassword'],
  message:'Mật khẩu xác nhận không khớp',
});


export type LoginFormInputs = z.infer<typeof LoginSchema>;
export type RegisterFormInputs = z.infer<typeof RegisterSchema>;
