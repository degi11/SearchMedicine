import MedicineDetail from "@/components/medicine-detail";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <MedicineDetail id={params.id} />;
}