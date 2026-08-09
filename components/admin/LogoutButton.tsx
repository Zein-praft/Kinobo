"use client";

/**
 * Tombol logout admin — Client Component yang memanggil Server Action `logoutAction`.
 */
import { useTransition } from "react";
import { logoutAction } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <Button
      variant="secondary"
      onClick={handleLogout}
      disabled={isPending}
      className="text-xs px-3 py-1.5"
    >
      {isPending ? "Keluar..." : "Logout"}
    </Button>
  );
}
