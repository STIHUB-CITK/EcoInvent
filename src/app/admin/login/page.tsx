
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const MOCK_EMAIL = "admin@ecoinvent.in";
const MOCK_PASSWORD = "password"; // In a real app, never hardcode passwords!

export default function AdminLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (localStorage.getItem("isAdminLoggedIn") === "true") {
      router.replace("/admin/submissions");
    }
  }, [router]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: LoginFormValues) {
    if (data.email === MOCK_EMAIL && data.password === MOCK_PASSWORD) {
      localStorage.setItem("isAdminLoggedIn", "true");
      toast({
        title: "Login Successful",
        description: "Redirecting to admin dashboard...",
      });
      router.push("/admin/submissions");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
  }

  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Icons.UserCircle className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-primary">Admin Login</CardTitle>
          <CardDescription>Access the EcoInvent submissions dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg py-6" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Icons.RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Use: <code className="bg-muted px-1 py-0.5 rounded">admin@ecoinvent.in</code> / <code className="bg-muted px-1 py-0.5 rounded">password</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
