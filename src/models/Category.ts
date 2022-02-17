import { IconName } from "components";

const CategoryTypeCodeValues = ["INCOME", "EXPENSES"] as const;

type CategoryTypeCode = typeof CategoryTypeCodeValues[number];

const categoryNameValues = [
  "food delivery",
  "groceries",
  "salary",
  "transport",
  "gifts",
  "gadgets",
  "bills",
  "coffee",
  "unknown"
] as const;

type CategoryName = typeof categoryNameValues[number];

export interface Category {
  name: CategoryName;
  type: CategoryTypeCode;
  icon: IconName;
}
