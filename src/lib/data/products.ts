export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string;
  badge?: string;
  stock?: number;
  type?: "menu" | "retail" | "raw_material";
  unavailableReason?: string;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Double Espresso",
    description: "House Blend, 2oz",
    price: 3.5,
    category: "coffee",
    image: "/images/espresso.png",
    badge: "Popular",
  },
  {
    id: "p2",
    name: "Classic Latte",
    description: "Steamed milk, Rosetta art",
    price: 4.75,
    category: "coffee",
    image: "/images/latte.png",
  },
  {
    id: "p3",
    name: "Flat White",
    description: "Strong, silky microfoam",
    price: 4.25,
    category: "coffee",
    image: "/images/flat-white.png",
  },
  {
    id: "p4",
    name: "Iced V60",
    description: "Single origin, pour-over on ice",
    price: 6.5,
    category: "coffee",
    image: "/images/iced-v60.jpg",
  },
  {
    id: "p5",
    name: "Ethiopian S.O.",
    description: "Yirgacheffe, Fruity notes",
    price: 4.8,
    category: "coffee",
    image: "/images/ethiopian.jpg",
  },
  {
    id: "p6",
    name: "Oat Milk Latte",
    description: "Oatly Barista Edition",
    price: 6.0,
    category: "coffee",
    image: "/images/oat-latte.jpg",
    badge: "Best Seller",
  },
  {
    id: "p7",
    name: "Cortado",
    description: "Equal parts espresso & milk",
    price: 4.0,
    category: "coffee",
    image: "/images/cortado.jpg",
  },
  {
    id: "p8",
    name: "Cold Brew",
    description: "16hr steeped, smooth & bold",
    price: 5.5,
    category: "coffee",
    image: "/images/cold-brew.jpg",
  },
  {
    id: "p9",
    name: "Ceremonial Matcha",
    description: "Uji Grade, Oat milk",
    price: 5.5,
    category: "non-coffee",
    image: "/images/matcha.jpg",
  },
  {
    id: "p10",
    name: "Chai Latte",
    description: "Spiced masala blend",
    price: 5.0,
    category: "non-coffee",
    image: "/images/chai.jpg",
  },
  {
    id: "p11",
    name: "Hot Chocolate",
    description: "Belgian cocoa, whipped cream",
    price: 4.5,
    category: "non-coffee",
    image: "/images/hot-choco.jpg",
  },
  {
    id: "p12",
    name: "Fresh Orange Juice",
    description: "Cold-pressed, no sugar added",
    price: 5.0,
    category: "non-coffee",
    image: "/images/orange-juice.jpg",
  },
  {
    id: "p13",
    name: "Butter Croissant",
    description: "Freshly baked, daily",
    price: 3.25,
    category: "food",
    image: "/images/croissant.jpg",
  },
  {
    id: "p14",
    name: "Atelier Sourdough",
    description: "Avocado, Poached Egg",
    price: 12.0,
    category: "food",
    image: "/images/sourdough.jpg",
  },
  {
    id: "p15",
    name: "Pain au Chocolat",
    description: "Dark chocolate, flaky pastry",
    price: 3.75,
    category: "food",
    image: "/images/pain-choco.jpg",
  },
  {
    id: "p16",
    name: "Almond Croissant",
    description: "Marzipan filled, toasted almonds",
    price: 4.0,
    category: "food",
    image: "/images/almond-croissant.jpg",
  },
  {
    id: "p17",
    name: "Atelier Tote Bag",
    description: "Canvas, limited edition",
    price: 24.0,
    category: "merchandise",
    image: "/images/tote-bag.jpg",
  },
  {
    id: "p18",
    name: "Ceramic Mug",
    description: "Hand-thrown, 12oz",
    price: 18.0,
    category: "merchandise",
    image: "/images/mug.jpg",
  },
];

export const categories = [
  { label: "All Menu", value: "all" },
  { label: "Coffee", value: "coffee" },
  { label: "Non-Coffee", value: "non-coffee" },
  { label: "Food", value: "food" },
  { label: "Merchandise", value: "merchandise" },
] as const;

export type CategoryValue = (typeof categories)[number]["value"];
