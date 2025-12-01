import MedicineDetail from "@/components/medicine-detail";

export default async function Home(props: any) {
  const { id } = props.params;
  return <MedicineDetail id={id} />;
}
