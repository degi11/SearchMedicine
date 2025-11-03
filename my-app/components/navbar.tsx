"use client";
import LoginIcon from "@/ascents/login-icon";
import { LogOutIcon, Search, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      console.log("Token in Navbar:", token);
      setIsLoggedIn(!!token);
    };
    checkToken();
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    setIsLoggedIn(false);
    router.push("/");
  };
  return (
    <header className="w-full bg-white">
      <div className="w-full shadow-lg border-b-grey-500 border">
        <div className="flex justify-center px-4 sm:px-6 lg:px-8 py-6 items-center">
          <div className="flex gap-3 w-full justify-center-safe">
            <div className="flex items-center justify-center w-15 h-15 bg-[#00AC94] rounded-lg">
              <Search size={32} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Эмийг ол
              </h1>
              <p>Олсон эм ээ унш</p>
            </div>
          </div>

          <div className="flex justify-items-end ">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>
                    <UserRound className="w-7 h-7" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuItem><Link href="/new-medicine">Эм нэмэх</Link></DropdownMenuItem>
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
