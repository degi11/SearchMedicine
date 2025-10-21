import { Search } from "lucide-react"


export default function Navbar() {
    return (
        <header className="w-full bg-white">
            <div className="w-full shadow-lg border-b-grey-500 border-1">
                <div className="flex justify-center px-4 sm:px-6 lg:px-8 py-6 gap-3 items-center">
<div className="flex items-center justify-center w-15 h-15 bg-blue-500 rounded-lg">
<Search size={32}/>
                </div>
            <div>
                <h1 className="text-4xl font-bold text-gray-900">Эмийг ол</h1>
                <p>Олсон эм ээ унш</p>
            </div>
                </div>
                
            </div>
                
        </header>
    )
}