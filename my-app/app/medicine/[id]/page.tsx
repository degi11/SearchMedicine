import MedicineDetail from "@/components/medicine-detail";

export default async function Home({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <MedicineDetail id={params.id} />
    </div>
  );
}
