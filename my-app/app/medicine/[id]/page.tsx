import MedicineDetail from "@/components/medicine-detail";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <MedicineDetail id={id} />;
}