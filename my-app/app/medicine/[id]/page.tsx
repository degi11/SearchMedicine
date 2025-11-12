import MedicineDetail from "@/components/medicine-detail";

export default async function Home({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <MedicineDetail id={id} />
    </div>
  );
}
