
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";

// Define a subset of ProfileType specifically for registration
const registrationProfileTypes = ["artist", "fan", "collaborator"] as const;
type RegistrationProfileType = typeof registrationProfileTypes[number];

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .max(20, {
      message: "Username must not exceed 20 characters.",
    })
    .regex(/^[a-z0-9_]+$/, {
      message: "Username can only contain lowercase letters, numbers, and underscores.",
    }),
  display_name: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  profile_type: z.enum(registrationProfileTypes, {
    required_error: "Please select a profile type.",
  }),
});

export type RegisterFormValues = z.infer<typeof formSchema>;

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      display_name: "",
      profile_type: "fan" as RegistrationProfileType,
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      setIsLoading(true);
      const { success } = await register(values.email, values.password, {
        username: values.username,
        display_name: values.display_name,
        profile_type: values.profile_type,
      });
      
      if (success) {
        onSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  {...field}
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="username"
                    {...field}
                    autoComplete="username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Name"
                    {...field}
                    autoComplete="name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="profile_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="fan">Fan</SelectItem>
                  <SelectItem value="artist">Artist</SelectItem>
                  <SelectItem value="collaborator">Collaborator</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            "Creating Account..."
          ) : (
            <>
              <User className="mr-2 h-4 w-4" /> Create Account
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
