export interface SimpleTransfer {
  id: string;
  userId: string;
  amount: number;
  label: string;
  thumbnailUrl?: string;
  kind: "credit" | "debit";
  date: Date;
}
