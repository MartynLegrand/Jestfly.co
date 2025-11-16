
import * as z from 'zod';

// Define form schema with required fields
export const checkoutFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  paymentMethod: z.enum(['jestcoin', 'credit_card', 'stripe'], {
    required_error: 'Selecione um método de pagamento',
  }),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

// Export the type for form values
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
