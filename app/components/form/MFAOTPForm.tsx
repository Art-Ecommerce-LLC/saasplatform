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
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from "@/app/components/hooks/use-toast"
import { signIn } from 'next-auth/react';

const FormSchema = z.object({
    OTP: z
      .string()
      .min(6, 'OTP must be 6 digits')
      .max(6, 'OTP must be 6 digits')
      .regex(/^\d{6}$/, 'OTP must be a 6-digit number'), // Ensure it's a number
  });


const MFAOTPForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to access URL parameters
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      OTP: '',
    },
  });

  const sessionToken = searchParams.get('sessionToken'); // Get the sessionToken from the URL
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {

    // Send the OTP and session Token to the server in a post request to validate the OTP
    const validateOTP = await fetch('/api/validate-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        OTP: values.OTP,
        sessionToken: sessionToken,
      }),
    });

    const signInData = await validateOTP.json();

    const signInAuth = await signIn('credentials', {
      redirect: false,
      sessionToken: signInData.sessionToken,
      "2FA_key": signInData.OTP,
    });


    if (signInAuth?.error) {
      toast({
        title: "Error",
        description: "OTP Failed",
        variant: "destructive",
        className: `
        fixed bottom-4 right-4 z-50 w-3/5 sm:max-w-sm md:max-w-sd
      `,
    });
    } else {
        router.refresh();
        router.push('/admin');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <div className='space-y-2'>
          <FormField
            control={form.control}
            name='OTP'
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP Code</FormLabel>
                <FormControl>
                  <Input placeholder='123456' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className='w-full mt-6' type='submit'>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default MFAOTPForm;