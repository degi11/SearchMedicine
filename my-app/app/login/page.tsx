import Login from "@/components/login";
import Link from "next/link";

export default function Home () {
    return(
        <div className="max-w-3xl mt-50 mx-auto flex items-center justify-center flex-col gap-2">
            <Link href="/" className="text-2xl hover:text-[#00AC94]">
               HOME 
            </Link>
            <Login />    
        </div>
        
    )
}