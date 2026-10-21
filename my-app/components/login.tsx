"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
 
interface LoginResponse {
  token: string;
  role: "admin" | "user";
  message?: string;
}
 
const ROLE_ROUTES: Record<LoginResponse["role"], string> = {
  admin: "/admin",
  user: "/dashboard",
};
 
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 
  const router = useRouter();
  const { loginWithToken } = useAuth();
 
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
 
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
 
      const data: LoginResponse = await res.json().catch(() => {
        throw new Error("Серверийн хариу буруу форматтай байна.");
      });
 
      if (!res.ok) {
        setError(data.message || "Нэвтрэхэд алдаа гарлаа.");
        return;
      }
 
      loginWithToken(data.token);
 
      router.push(ROLE_ROUTES[data.role] ?? "/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Серверийн алдаа.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Нэвтрэх</CardTitle>
        <CardDescription>
          И-мэйл болон нууц үгээ оруулна уу.
        </CardDescription>
      </CardHeader>
 
      <CardContent>
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Input
              id="email"
              type="email"
              placeholder="И-мэйл"
              autoComplete="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
 
          <div className="grid gap-2">
            <Input
              id="password"
              type="password"
              placeholder="Нууц үг"
              autoComplete="current-password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
 
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
 
          <Button
            type="submit"
            className="w-full bg-[#00AC94] hover:bg-[#00AC94]/90"
            disabled={isLoading}
          >
            {isLoading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}