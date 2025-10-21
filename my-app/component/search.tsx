import { Input } from "@/components/ui/input";

export default function Search() {
    return (
        <form className="mt-6">
            <div className="flex max-w-7xl gap-50">
                <div>
                    <Input className="w-100 border-black" placeholder="name"/>
                </div>
                <div>
                    <Input className="w-100 border-black" placeholder="bar code"/>
                </div>
            </div>
        </form>
    )   
}