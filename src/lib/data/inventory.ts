export interface InventoryItem {
  id: string;
  name: string;
  subtitle: string;
  currentStock: number;
  unit: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
  pricePerUnit: string;
  supplier: string;
  image: string;
}

export const inventoryItems: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Ethiopian Yirgacheffe",
    subtitle: "Whole Bean Roast",
    currentStock: 12.5,
    unit: "Kilograms",
    status: "in_stock",
    pricePerUnit: "$28.00 / kg",
    supplier: "Atlas Coffee Importers",
    image: "/images/ethiopian.jpg",
  },
  {
    id: "inv-2",
    name: "Oat Milk (Barista Ed.)",
    subtitle: "Dairy Alternative",
    currentStock: 4.0,
    unit: "Liters",
    status: "low_stock",
    pricePerUnit: "$4.50 / L",
    supplier: "Oatly Distribution",
    image: "/images/oat-latte.jpg",
  },
  {
    id: "inv-3",
    name: "Madagascar Vanilla",
    subtitle: "Artisan Syrup",
    currentStock: 18.0,
    unit: "Bottles",
    status: "in_stock",
    pricePerUnit: "$12.00 / Btl",
    supplier: "Atelier Signature",
    image: "/images/matcha.jpg",
  },
  {
    id: "inv-4",
    name: "Colombian Supremo",
    subtitle: "Medium Roast Blend",
    currentStock: 8.0,
    unit: "Kilograms",
    status: "in_stock",
    pricePerUnit: "$22.00 / kg",
    supplier: "Atlas Coffee Importers",
    image: "/images/espresso.png",
  },
  {
    id: "inv-5",
    name: "Almond Milk",
    subtitle: "Dairy Alternative",
    currentStock: 2.5,
    unit: "Liters",
    status: "low_stock",
    pricePerUnit: "$5.00 / L",
    supplier: "Alpro Distribution",
    image: "/images/latte.png",
  },
  {
    id: "inv-6",
    name: "Caramel Syrup",
    subtitle: "Premium Syrup",
    currentStock: 22.0,
    unit: "Bottles",
    status: "in_stock",
    pricePerUnit: "$10.50 / Btl",
    supplier: "Atelier Signature",
    image: "/images/cold-brew.jpg",
  },
  {
    id: "inv-7",
    name: "Whole Milk",
    subtitle: "Fresh Dairy",
    currentStock: 1.5,
    unit: "Liters",
    status: "low_stock",
    pricePerUnit: "$2.80 / L",
    supplier: "Local Farm Co.",
    image: "/images/flat-white.png",
  },
  {
    id: "inv-8",
    name: "Matcha Powder",
    subtitle: "Ceremonial Uji Grade",
    currentStock: 3.0,
    unit: "Cans",
    status: "low_stock",
    pricePerUnit: "$35.00 / Can",
    supplier: "Kyoto Tea Imports",
    image: "/images/matcha.jpg",
  },
];
