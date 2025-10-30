import LoginIcon from "@/ascents/login-icon";
import { Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full bg-white">
      <div className="w-full shadow-lg border-b-grey-500 border">
        <div className="flex justify-center px-4 sm:px-6 lg:px-8 py-6 items-center">
          <div className="flex gap-3 w-full justify-center-safe">
            <div className="flex items-center justify-center w-15 h-15 bg-[#00AC94] rounded-lg">
              <Search size={32} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Эмийг ол</h1>
              <p>Олсон эм ээ унш</p>
            </div>
          </div>

          <div className="flex justify-items-end ">
            <LoginIcon/>
          </div>
        </div>
      </div>
    </header>
  );
}
