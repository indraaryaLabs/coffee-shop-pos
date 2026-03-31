export interface Transaction {
  id: string;
  customer: string;
  items: string;
  status: "completed" | "processing" | "cancelled";
  total: number;
  date: string;
  time: string;
  cashier: string;
  cashierInitials: string;
  paymentMethod: "credit_card" | "cash" | "mobile_pay" | "debit";
}

export const transactions: Transaction[] = [
  {
    id: "#AL-9824",
    customer: "Marcus Thorne",
    items: "Oat Latte, Avocado Toast, Filtered Water",
    status: "completed",
    total: 32.5,
    date: "Oct 19, 2023",
    time: "02:45 PM",
    cashier: "Elena M.",
    cashierInitials: "EM",
    paymentMethod: "credit_card",
  },
  {
    id: "#AL-9823",
    customer: "Sarah Jennings",
    items: "Flat White x2, Almond Croissant",
    status: "completed",
    total: 18.2,
    date: "Oct 19, 2023",
    time: "02:32 PM",
    cashier: "Julian D.",
    cashierInitials: "JD",
    paymentMethod: "cash",
  },
  {
    id: "#AL-9822",
    customer: "Guest #102",
    items: "Cold Brew (Large)",
    status: "processing",
    total: 6.5,
    date: "Oct 19, 2023",
    time: "01:58 PM",
    cashier: "Sasha M.",
    cashierInitials: "SM",
    paymentMethod: "mobile_pay",
  },
  {
    id: "#AL-9821",
    customer: "David Chen",
    items: "Cortado, Pain au Chocolat",
    status: "completed",
    total: 11.75,
    date: "Oct 19, 2023",
    time: "01:15 PM",
    cashier: "Elena M.",
    cashierInitials: "EM",
    paymentMethod: "credit_card",
  },
  {
    id: "#AL-9820",
    customer: "Aisha Romero",
    items: "Ceremonial Matcha, Butter Croissant",
    status: "completed",
    total: 8.75,
    date: "Oct 18, 2023",
    time: "04:20 PM",
    cashier: "Julian D.",
    cashierInitials: "JD",
    paymentMethod: "debit",
  },
  {
    id: "#AL-9819",
    customer: "Leo Tanaka",
    items: "Double Espresso x2",
    status: "completed",
    total: 7.0,
    date: "Oct 18, 2023",
    time: "03:50 PM",
    cashier: "Sasha M.",
    cashierInitials: "SM",
    paymentMethod: "mobile_pay",
  },
  {
    id: "#AL-9818",
    customer: "Nina Volkov",
    items: "Classic Latte, Atelier Sourdough",
    status: "completed",
    total: 16.75,
    date: "Oct 18, 2023",
    time: "12:10 PM",
    cashier: "Elena M.",
    cashierInitials: "EM",
    paymentMethod: "credit_card",
  },
  {
    id: "#AL-9817",
    customer: "Guest #98",
    items: "Iced V60, Pain au Chocolat",
    status: "cancelled",
    total: 10.25,
    date: "Oct 18, 2023",
    time: "11:40 AM",
    cashier: "Julian D.",
    cashierInitials: "JD",
    paymentMethod: "cash",
  },
];

export const weeklyRevenue = [
  { day: "Mon", revenue: 1200, orders: 85 },
  { day: "Tue", revenue: 1950, orders: 132 },
  { day: "Wed", revenue: 1650, orders: 112 },
  { day: "Thu", revenue: 2550, orders: 178 },
  { day: "Fri", revenue: 3000, orders: 205 },
  { day: "Sat", revenue: 2750, orders: 192 },
  { day: "Sun", revenue: 2350, orders: 160 },
];

export const topSellers = [
  {
    name: "Oat Milk Latte",
    sold: 124,
    revenue: 744.0,
    image: "/images/oat-latte.jpg",
  },
  {
    name: "Ethiopian S.O.",
    sold: 88,
    revenue: 422.4,
    image: "/images/ethiopian.jpg",
  },
  {
    name: "Iced V60",
    sold: 56,
    revenue: 364.0,
    image: "/images/iced-v60.jpg",
  },
];
