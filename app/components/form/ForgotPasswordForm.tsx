'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from "@/app/components/hooks/use-toast"

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

const ForgotPasswordForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
      }),
    });

    const signInDataJson = await signInData.json();

    if (signInDataJson?.error) {
      toast({
        title: "Error",
        description: "Something Went Wrong",
        variant: "destructive",
        className: `
        fixed bottom-4 right-4 z-50 w-3/5 sm:max-w-sm md:max-w-sd
      `,
      });
      // check if signInDataJson.user.emailVerified is null
    } else if (!signInDataJson.user.emailVerified) {
      router.push(`/verify-notice?sessionToken=${signInDataJson.sessionToken}`);
    } else {
      router.push('/email-mfa');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <div className='space-y-2'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='mail@example.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <Button className='w-full mt-6' type='submit'>
          Send Password Reset Email
        </Button>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;