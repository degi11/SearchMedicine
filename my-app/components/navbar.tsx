"use client";
import LoginIcon from "@/ascents/login-icon";
import { Search, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const res = await fetch("/api/check-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        setIsLoggedIn(data.loggedIn);
      } catch (err) {
        console.error("Auth check error:", err);
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  const handleNewMedicine = () => router.push("/new-medicine");
  const handleLogin = () => router.push("/login");

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setIsLoggedIn(false);
    router.push("/");
  };
  return (
    <header className="w-full bg-white">
      <div className="w-full shadow-lg border-b-grey-500 border">
        <div className="flex justify-center px-4 sm:px-6 lg:px-8 py-6 items-center">
          <div className="flex gap-3 w-full justify-center-safe">
            <div className="flex items-center justify-center w-15 h-15 bg-[#00AC94] rounded-lg">
              <Search className="" size={32} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Эмийг ол
              </h1>
              <p>Олсон эм ээ унш</p>
            </div>
          </div>
          <div className="flex justify-items-end">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>
                    <UserRound className="w-7 h-7" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuItem onClick={handleNewMedicine}>
                    Эм нэмэх
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Гарах
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                onClick={handleLogin}
                className="flex items-center gap-2"
              >
                <LoginIcon />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
