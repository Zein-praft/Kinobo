"use client";

/**
 * Form login admin — Client Component dengan react-hook-form + zod validasi.
 * Memanggil Server Action `loginAction` saat form disubmit.
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchemaValues } from "@/lib/validations/auth";
import { loginAction } from "@/app/(auth)/login/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaValues) => {
    setServerError(null);
    const result = await loginAction(data);
    if (result?.error) {
      setServerError(result.error);
    }
  };

  return (
    <Card title="Login Admin Kinobo" className="w-full max-w-md shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
            {serverError}
          </div>
        )}
        <Input
          label="Email"
          type="email"
          placeholder="admin@kinobo.com"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />
        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
          {isSubmitting ? "Memproses..." : "Masuk ke Panel Admin"}
        </Button>
      </form>
    </Card>
  );
}
