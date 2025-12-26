export interface MedicineCardProrps {
  medicineName: string | null;
  dosage: string | null;
  no: string | number | null;
  dosageForm: string | null;
  conditionsOfIssue: boolean | null;
  registered: string | null;
  country: string | null;
  storageConditions: string | null;
  imageUrl: string | null;
  id: string | null;
}

export interface DoseUsage {
  age: string;
  dose: string;
  time: string;
}

export interface AdultDose {
  dose: string;
  time: string;
}

export interface IODrugs {
  positive: string;
  negative: string;
}

export interface PPprops {
  prohibitions: string;
  precautions: string;
}

export interface DeleteButtonProps {
  medicineId: string;
}

export interface EditButtonProps {
  medicine: any;
}

export interface CartItem {
  id: string;
  name: string;
  storageCo: string;
  quantity?: number;
}

export interface PrintRecipeProps {
  cart: CartItem[];
  inputs: Record<
    string,
    {
      dose?: string;
      times?: string;
      timesOption?: string;
      perDay?: string;
      doseType?: string;
      howToUse?: string;
    }
  >;
}
