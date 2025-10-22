import Search from "@/component/search";
import prisma from "@/lib/prisma";


export default async function Home() {
    const Medicine = await prisma.medicine.findMany()
  return (
    <div className="flex items-center justify-center">
      <Search />
      {Medicine.map((el, id) => (
        <div key={id}>{el.id}</div>
      ))}
    </div>
  );
}