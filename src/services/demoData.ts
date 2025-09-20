// Demo data service for all pages
import potteryImage from "@/assets/pottery-collection.jpg";
import artisanImage from "@/assets/artisan-priya.jpg";

export interface DemoProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  artisan: string;
  location: string;
  rating: number;
  reviews: number;
  category: string;
  description: string;
  voiceStory?: string;
  status: "active" | "draft" | "out-of-stock";
  sold: number;
  views: number;
  likes: number;
}

export interface DemoArtisan {
  id: string;
  name: string;
  craft: string;
  location: string;
  image: string;
  rating: number;
  followers: number;
  experience: string;
  description: string;
  speciality: string[];
}

export interface DemoOrder {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  orderDate: string;
  customer: string;
  customerEmail: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  role: "artisan" | "customer" | "admin";
  craft?: string;
  avatar?: string;
}

// Demo products data
export const demoProducts: DemoProduct[] = [
  {
    id: "prod-001",
    name: "Handcrafted Clay Pot Set",
    price: 2499,
    originalPrice: 3199,
    image: potteryImage,
    artisan: "Priya Sharma",
    location: "Jaipur, Rajasthan",
    rating: 4.8,
    reviews: 156,
    category: "pottery",
    description:
      "Beautiful handcrafted clay pot set made with traditional techniques passed down through generations.",
    voiceStory: "Listen to Priya explain the ancient art of pottery making...",
    status: "active",
    sold: 89,
    views: 1250,
    likes: 234,
  },
  {
    id: "prod-002",
    name: "Traditional Brass Lamp",
    price: 1899,
    image: potteryImage,
    artisan: "Ramesh Kumar",
    location: "Moradabad, UP",
    rating: 4.6,
    reviews: 89,
    category: "metalwork",
    description:
      "Elegant brass lamp with intricate engravings, perfect for festivals and daily worship.",
    status: "active",
    sold: 45,
    views: 890,
    likes: 167,
  },
  {
    id: "prod-003",
    name: "Embroidered Silk Scarf",
    price: 1299,
    originalPrice: 1599,
    image: potteryImage,
    artisan: "Meera Devi",
    location: "Lucknow, UP",
    rating: 4.9,
    reviews: 203,
    category: "textiles",
    description:
      "Exquisite Chikankari embroidered silk scarf showcasing the finest needlework.",
    status: "active",
    sold: 156,
    views: 2100,
    likes: 345,
  },
  {
    id: "prod-004",
    name: "Wooden Jewelry Box",
    price: 899,
    image: potteryImage,
    artisan: "Suresh Chandra",
    location: "Saharanpur, UP",
    rating: 4.4,
    reviews: 67,
    category: "woodcraft",
    description:
      "Handcarved wooden jewelry box with traditional motifs and secure compartments.",
    status: "draft",
    sold: 23,
    views: 456,
    likes: 89,
  },
  {
    id: "prod-005",
    name: "Silver Anklet Pair",
    price: 3499,
    image: potteryImage,
    artisan: "Kavita Jain",
    location: "Bikaner, Rajasthan",
    rating: 4.7,
    reviews: 134,
    category: "jewelry",
    description:
      "Pure silver anklets with traditional Rajasthani designs and temple motifs.",
    status: "out-of-stock",
    sold: 78,
    views: 1890,
    likes: 298,
  },
  {
    id: "prod-006",
    name: "Blue Pottery Dinner Plates",
    price: 1799,
    originalPrice: 2199,
    image: potteryImage,
    artisan: "Priya Sharma",
    location: "Jaipur, Rajasthan",
    rating: 4.9,
    reviews: 142,
    category: "pottery",
    description:
      "Set of 6 handcrafted blue pottery dinner plates with traditional Jaipur patterns.",
    voiceStory: "Discover the secrets of blue pottery glazing techniques...",
    status: "active",
    sold: 67,
    views: 980,
    likes: 189,
  },
  {
    id: "prod-007",
    name: "Brass Water Bottle",
    price: 899,
    image: potteryImage,
    artisan: "Ramesh Kumar",
    location: "Moradabad, UP",
    rating: 4.5,
    reviews: 78,
    category: "metalwork",
    description:
      "Handcrafted brass water bottle with Ayurvedic benefits and elegant design.",
    status: "active",
    sold: 134,
    views: 1567,
    likes: 289,
  },
  {
    id: "prod-008",
    name: "Chikankari Kurta Set",
    price: 2999,
    originalPrice: 3599,
    image: potteryImage,
    artisan: "Meera Devi",
    location: "Lucknow, UP",
    rating: 4.8,
    reviews: 245,
    category: "textiles",
    description:
      "Premium cotton kurta with intricate Chikankari embroidery, perfect for formal occasions.",
    status: "active",
    sold: 89,
    views: 2567,
    likes: 456,
  },
  {
    id: "prod-009",
    name: "Carved Wooden Mirror",
    price: 1599,
    image: potteryImage,
    artisan: "Suresh Chandra",
    location: "Saharanpur, UP",
    rating: 4.6,
    reviews: 92,
    category: "woodcraft",
    description:
      "Intricately carved wooden mirror frame with traditional Indian motifs.",
    status: "active",
    sold: 56,
    views: 734,
    likes: 123,
  },
  {
    id: "prod-010",
    name: "Silver Nose Ring Collection",
    price: 1299,
    image: potteryImage,
    artisan: "Kavita Jain",
    location: "Bikaner, Rajasthan",
    rating: 4.7,
    reviews: 167,
    category: "jewelry",
    description:
      "Traditional silver nose rings with precious stone accents, handcrafted with love.",
    status: "active",
    sold: 245,
    views: 3456,
    likes: 567,
  },
  {
    id: "prod-011",
    name: "Terracotta Garden Planters",
    price: 799,
    originalPrice: 999,
    image: potteryImage,
    artisan: "Priya Sharma",
    location: "Jaipur, Rajasthan",
    rating: 4.4,
    reviews: 89,
    category: "pottery",
    description:
      "Set of 3 handmade terracotta planters with drainage holes, perfect for herbs and flowers.",
    status: "active",
    sold: 123,
    views: 876,
    likes: 145,
  },
  {
    id: "prod-012",
    name: "Brass Pooja Thali Set",
    price: 1499,
    image: potteryImage,
    artisan: "Ramesh Kumar",
    location: "Moradabad, UP",
    rating: 4.8,
    reviews: 156,
    category: "metalwork",
    description:
      "Complete brass pooja thali set with diya, incense holder, and offering bowls.",
    status: "active",
    sold: 78,
    views: 1234,
    likes: 234,
  },
  {
    id: "prod-013",
    name: "Hand Block Print Bedsheet",
    price: 1999,
    originalPrice: 2399,
    image: potteryImage,
    artisan: "Meera Devi",
    location: "Lucknow, UP",
    rating: 4.6,
    reviews: 134,
    category: "textiles",
    description:
      "Double bed cotton bedsheet with pillow covers featuring traditional block print designs.",
    status: "active",
    sold: 89,
    views: 1567,
    likes: 278,
  },
  {
    id: "prod-014",
    name: "Sheesham Wood Dining Table",
    price: 15999,
    originalPrice: 18999,
    image: potteryImage,
    artisan: "Suresh Chandra",
    location: "Saharanpur, UP",
    rating: 4.9,
    reviews: 45,
    category: "woodcraft",
    description:
      "Handcrafted 6-seater dining table made from premium Sheesham wood with carved legs.",
    status: "active",
    sold: 12,
    views: 567,
    likes: 89,
  },
  {
    id: "prod-015",
    name: "Gold Plated Jhumkas",
    price: 2299,
    image: potteryImage,
    artisan: "Kavita Jain",
    location: "Bikaner, Rajasthan",
    rating: 4.7,
    reviews: 189,
    category: "jewelry",
    description:
      "Traditional gold-plated jhumka earrings with kundan work and pearl drops.",
    status: "active",
    sold: 156,
    views: 2345,
    likes: 389,
  },
  {
    id: "prod-016",
    name: "Ceramic Tea Set",
    price: 1299,
    image: potteryImage,
    artisan: "Priya Sharma",
    location: "Jaipur, Rajasthan",
    rating: 4.5,
    reviews: 98,
    category: "pottery",
    description:
      "Hand-painted ceramic tea set with teapot, 4 cups, and saucers in floral design.",
    status: "draft",
    sold: 34,
    views: 456,
    likes: 67,
  },
  {
    id: "prod-017",
    name: "Copper Moscow Mule Mugs",
    price: 1199,
    originalPrice: 1399,
    image: potteryImage,
    artisan: "Ramesh Kumar",
    location: "Moradabad, UP",
    rating: 4.6,
    reviews: 112,
    category: "metalwork",
    description:
      "Set of 4 handcrafted copper mugs with hammered finish, perfect for cocktails.",
    status: "active",
    sold: 67,
    views: 789,
    likes: 145,
  },
  {
    id: "prod-018",
    name: "Bandhani Silk Dupatta",
    price: 899,
    image: potteryImage,
    artisan: "Meera Devi",
    location: "Lucknow, UP",
    rating: 4.4,
    reviews: 76,
    category: "textiles",
    description:
      "Traditional Bandhani tie-dye silk dupatta in vibrant colors with mirror work.",
    status: "active",
    sold: 98,
    views: 1234,
    likes: 189,
  },
  {
    id: "prod-019",
    name: "Carved Wooden Bookshelf",
    price: 8999,
    originalPrice: 10999,
    image: potteryImage,
    artisan: "Suresh Chandra",
    location: "Saharanpur, UP",
    rating: 4.8,
    reviews: 34,
    category: "woodcraft",
    description:
      "5-tier wooden bookshelf with intricate carvings and antique finish.",
    status: "active",
    sold: 23,
    views: 345,
    likes: 56,
  },
  {
    id: "prod-020",
    name: "Kundan Necklace Set",
    price: 4999,
    originalPrice: 5999,
    image: potteryImage,
    artisan: "Kavita Jain",
    location: "Bikaner, Rajasthan",
    rating: 4.9,
    reviews: 78,
    category: "jewelry",
    description:
      "Elegant kundan necklace set with matching earrings and maang tikka for special occasions.",
    status: "out-of-stock",
    sold: 45,
    views: 1890,
    likes: 234,
  },
];

// Demo artisans data
export const demoArtisans: DemoArtisan[] = [
  {
    id: "artisan-001",
    name: "Priya Sharma",
    craft: "Pottery",
    location: "Jaipur, Rajasthan",
    image: "artisanImage",
    rating: 4.8,
    followers: 1250,
    experience: "15 years",
    description:
      "Master potter specializing in traditional Rajasthani blue pottery with modern designs.",
    speciality: ["Blue Pottery", "Decorative Vases", "Kitchen Sets"],
  },
  {
    id: "artisan-002",
    name: "Ramesh Kumar",
    craft: "Metalwork",
    location: "Moradabad, UP",
    image: "artisanImage",
    rating: 4.6,
    followers: 890,
    experience: "20 years",
    description:
      "Third-generation brass craftsman creating exquisite decorative and functional pieces.",
    speciality: ["Brass Artifacts", "Religious Items", "Home Decor"],
  },
  {
    id: "artisan-003",
    name: "Meera Devi",
    craft: "Embroidery",
    location: "Lucknow, UP",
    image: "artisanImage",
    rating: 4.9,
    followers: 2100,
    experience: "25 years",
    description:
      "Chikankari master known for her intricate needlework and innovative designs.",
    speciality: ["Chikankari", "Silk Embroidery", "Bridal Wear"],
  },
  {
    id: "artisan-004",
    name: "Suresh Chandra",
    craft: "Woodcraft",
    location: "Saharanpur, UP",
    image: "artisanImage",
    rating: 4.7,
    followers: 756,
    experience: "18 years",
    description:
      "Expert woodcarver specializing in furniture and decorative items using traditional techniques.",
    speciality: ["Furniture", "Decorative Items", "Religious Sculptures"],
  },
  {
    id: "artisan-005",
    name: "Kavita Jain",
    craft: "Jewelry",
    location: "Bikaner, Rajasthan",
    image: "artisanImage",
    rating: 4.8,
    followers: 1456,
    experience: "12 years",
    description:
      "Traditional jewelry maker specializing in Kundan and silver jewelry with contemporary appeal.",
    speciality: ["Kundan Work", "Silver Jewelry", "Bridal Sets"],
  },
  {
    id: "artisan-006",
    name: "Arjun Singh",
    craft: "Leather Work",
    location: "Kolhapur, Maharashtra",
    image: "artisanImage",
    rating: 4.5,
    followers: 634,
    experience: "14 years",
    description:
      "Master leather craftsman creating handmade bags, shoes, and accessories using traditional methods.",
    speciality: ["Handbags", "Footwear", "Belts & Accessories"],
  },
  {
    id: "artisan-007",
    name: "Lakshmi Rao",
    craft: "Weaving",
    location: "Kanchipuram, Tamil Nadu",
    image: "artisanImage",
    rating: 4.9,
    followers: 1890,
    experience: "22 years",
    description:
      "Expert silk weaver creating authentic Kanchipuram sarees with intricate patterns and pure gold threads.",
    speciality: ["Silk Sarees", "Wedding Collection", "Temple Borders"],
  },
  {
    id: "artisan-008",
    name: "Mohit Gupta",
    craft: "Stone Carving",
    location: "Makrana, Rajasthan",
    image: "artisanImage",
    rating: 4.6,
    followers: 445,
    experience: "16 years",
    description:
      "Skilled stone carver working with marble and sandstone to create sculptures and architectural elements.",
    speciality: [
      "Marble Sculptures",
      "Garden Statues",
      "Architectural Elements",
    ],
  },
  {
    id: "artisan-009",
    name: "Fatima Khan",
    craft: "Carpet Weaving",
    location: "Kashmir, J&K",
    image: "artisanImage",
    rating: 4.8,
    followers: 1123,
    experience: "19 years",
    description:
      "Traditional Kashmiri carpet weaver creating exquisite hand-knotted carpets with Persian and Mughal designs.",
    speciality: ["Persian Carpets", "Silk Rugs", "Wall Hangings"],
  },
  {
    id: "artisan-010",
    name: "Deepak Verma",
    craft: "Glass Work",
    location: "Firozabad, UP",
    image: "artisanImage",
    rating: 4.4,
    followers: 567,
    experience: "13 years",
    description:
      "Glass blowing artisan creating colorful bangles, decorative items, and artistic glassware.",
    speciality: ["Glass Bangles", "Decorative Items", "Art Glass"],
  },
];

// Demo orders data
export const demoOrders: DemoOrder[] = [
  {
    id: "order-001",
    productId: "prod-001",
    productName: "Handcrafted Clay Pot Set",
    quantity: 2,
    price: 4998,
    status: "pending",
    orderDate: "2025-09-18",
    customer: "Anjali Gupta",
    customerEmail: "anjali.gupta@email.com",
  },
  {
    id: "order-002",
    productId: "prod-003",
    productName: "Embroidered Silk Scarf",
    quantity: 1,
    price: 1299,
    status: "confirmed",
    orderDate: "2025-09-17",
    customer: "Rahul Verma",
    customerEmail: "rahul.verma@email.com",
  },
  {
    id: "order-003",
    productId: "prod-002",
    productName: "Traditional Brass Lamp",
    quantity: 1,
    price: 1899,
    status: "shipped",
    orderDate: "2025-09-15",
    customer: "Sunita Patel",
    customerEmail: "sunita.patel@email.com",
  },
  {
    id: "order-004",
    productId: "prod-001",
    productName: "Handcrafted Clay Pot Set",
    quantity: 1,
    price: 2499,
    status: "delivered",
    orderDate: "2025-09-12",
    customer: "Vikash Singh",
    customerEmail: "vikash.singh@email.com",
  },
  {
    id: "order-005",
    productId: "prod-008",
    productName: "Chikankari Kurta Set",
    quantity: 1,
    price: 2999,
    status: "delivered",
    orderDate: "2025-09-14",
    customer: "Pooja Sharma",
    customerEmail: "pooja.sharma@email.com",
  },
  {
    id: "order-006",
    productId: "prod-007",
    productName: "Brass Water Bottle",
    quantity: 3,
    price: 2697,
    status: "shipped",
    orderDate: "2025-09-16",
    customer: "Amit Kumar",
    customerEmail: "amit.kumar@email.com",
  },
  {
    id: "order-007",
    productId: "prod-010",
    productName: "Silver Nose Ring Collection",
    quantity: 2,
    price: 2598,
    status: "delivered",
    orderDate: "2025-09-11",
    customer: "Riya Jain",
    customerEmail: "riya.jain@email.com",
  },
  {
    id: "order-008",
    productId: "prod-015",
    productName: "Gold Plated Jhumkas",
    quantity: 1,
    price: 2299,
    status: "confirmed",
    orderDate: "2025-09-19",
    customer: "Neha Agarwal",
    customerEmail: "neha.agarwal@email.com",
  },
  {
    id: "order-009",
    productId: "prod-013",
    productName: "Hand Block Print Bedsheet",
    quantity: 2,
    price: 3998,
    status: "pending",
    orderDate: "2025-09-18",
    customer: "Rajesh Gupta",
    customerEmail: "rajesh.gupta@email.com",
  },
  {
    id: "order-010",
    productId: "prod-017",
    productName: "Copper Moscow Mule Mugs",
    quantity: 1,
    price: 1199,
    status: "delivered",
    orderDate: "2025-09-13",
    customer: "Sonia Kapoor",
    customerEmail: "sonia.kapoor@email.com",
  },
  {
    id: "order-011",
    productId: "prod-011",
    productName: "Terracotta Garden Planters",
    quantity: 4,
    price: 3196,
    status: "shipped",
    orderDate: "2025-09-15",
    customer: "Deepak Singh",
    customerEmail: "deepak.singh@email.com",
  },
  {
    id: "order-012",
    productId: "prod-018",
    productName: "Bandhani Silk Dupatta",
    quantity: 1,
    price: 899,
    status: "delivered",
    orderDate: "2025-09-10",
    customer: "Kavita Yadav",
    customerEmail: "kavita.yadav@email.com",
  },
];

// Demo user (current artisan)
export const demoUser: DemoUser = {
  id: "demo-user-001",
  name: "Priya Sharma",
  email: "demo.artisan@voicetoshop.com",
  phone: "+91 98765 43210",
  location: "Jaipur, Rajasthan",
  role: "artisan",
  craft: "Pottery",
  avatar: "artisanImage",
};

// Demo analytics data
export const demoAnalytics = {
  totalProducts: 20,
  totalSales: 225750,
  followers: 1250,
  averageRating: 4.8,
  salesThisMonth: 65680,
  salesLastMonth: 58920,
  viewsThisWeek: 8240,
  viewsLastWeek: 7890,
  pendingOrders: 12,
  completedOrders: 187,
  revenue: {
    daily: [
      1200, 1800, 1500, 2200, 1900, 2100, 1700, 2400, 1600, 2000, 1800, 2300,
      1950, 2150,
    ],
    weekly: [12500, 14200, 13800, 15600, 14900, 16200, 15400],
    monthly: [48920, 52150, 49800, 58920, 62150, 65680],
    labels: {
      daily: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
      ],
      weekly: [
        "Week 1",
        "Week 2",
        "Week 3",
        "Week 4",
        "Week 5",
        "Week 6",
        "Week 7",
      ],
      monthly: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    },
  },
  categoryPerformance: [
    { category: "Pottery", sales: 45, revenue: 89750, growth: 15 },
    { category: "Metalwork", sales: 32, revenue: 56890, growth: 8 },
    { category: "Textiles", sales: 67, revenue: 78340, growth: 22 },
    { category: "Woodcraft", sales: 28, revenue: 45620, growth: -5 },
    { category: "Jewelry", sales: 89, revenue: 123450, growth: 35 },
  ],
  topProducts: [
    { name: "Embroidered Silk Scarf", sales: 156, revenue: 202644 },
    { name: "Silver Nose Ring Collection", sales: 245, revenue: 318255 },
    { name: "Copper Moscow Mule Mugs", sales: 134, revenue: 160666 },
    { name: "Handcrafted Clay Pot Set", sales: 89, revenue: 222411 },
    { name: "Brass Water Bottle", sales: 134, revenue: 120466 },
  ],
  customerDemographics: [
    { age: "18-25", percentage: 25, count: 312 },
    { age: "26-35", percentage: 35, count: 437 },
    { age: "36-45", percentage: 28, count: 350 },
    { age: "46-60", percentage: 12, count: 150 },
  ],
  salesByLocation: [
    { state: "Maharashtra", sales: 45, revenue: 125000 },
    { state: "Delhi", sales: 38, revenue: 98000 },
    { state: "Karnataka", sales: 52, revenue: 145000 },
    { state: "Gujarat", sales: 34, revenue: 89000 },
    { state: "Tamil Nadu", sales: 41, revenue: 112000 },
    { state: "Rajasthan", sales: 29, revenue: 78000 },
  ],
  orderStatus: [
    { status: "Delivered", count: 187, percentage: 78 },
    { status: "Shipped", count: 23, percentage: 10 },
    { status: "Processing", count: 18, percentage: 7 },
    { status: "Pending", count: 12, percentage: 5 },
  ],
  monthlyViews: [
    { month: "Jan", views: 3400, uniqueVisitors: 2100 },
    { month: "Feb", views: 4200, uniqueVisitors: 2800 },
    { month: "Mar", views: 3800, uniqueVisitors: 2400 },
    { month: "Apr", views: 5100, uniqueVisitors: 3200 },
    { month: "May", views: 6200, uniqueVisitors: 3800 },
    { month: "Jun", views: 5800, uniqueVisitors: 3600 },
    { month: "Jul", views: 7200, uniqueVisitors: 4400 },
    { month: "Aug", views: 8100, uniqueVisitors: 4900 },
    { month: "Sep", views: 8240, uniqueVisitors: 5100 },
  ],
  conversionRate: {
    current: 3.2,
    previous: 2.8,
    trend: "up",
  },
  averageOrderValue: {
    current: 1847,
    previous: 1634,
    trend: "up",
  },
  returnCustomers: {
    percentage: 34,
    count: 156,
    trend: "up",
  },
  ratingDistribution: [
    { stars: 5, count: 234, percentage: 68 },
    { stars: 4, count: 89, percentage: 26 },
    { stars: 3, count: 15, percentage: 4 },
    { stars: 2, count: 4, percentage: 1 },
    { stars: 1, count: 2, percentage: 1 },
  ],
};

// Demo cart items
export const demoCartItems = [
  {
    id: "cart-001",
    productId: "prod-001",
    product: demoProducts[0],
    quantity: 2,
    addedAt: "2025-09-19",
  },
  {
    id: "cart-002",
    productId: "prod-003",
    product: demoProducts[2],
    quantity: 1,
    addedAt: "2025-09-18",
  },
];

// Demo notifications
export const demoNotifications = [
  {
    id: "notif-001",
    type: "order",
    title: "New Order Received",
    message: "Anjali Gupta ordered 2x Handcrafted Clay Pot Set",
    timestamp: "2025-09-19T10:30:00Z",
    read: false,
  },
  {
    id: "notif-002",
    type: "review",
    title: "New Review",
    message: "Rahul Verma gave you 5 stars for Embroidered Silk Scarf",
    timestamp: "2025-09-18T15:45:00Z",
    read: false,
  },
  {
    id: "notif-003",
    type: "follower",
    title: "New Follower",
    message: "Sunita Patel started following you",
    timestamp: "2025-09-17T09:20:00Z",
    read: true,
  },
];

// Helper functions for demo mode
export const isDemoMode = (): boolean => {
  try {
    const demoAuth = localStorage.getItem("demoAuth");
    return demoAuth ? JSON.parse(demoAuth).isAuthenticated : false;
  } catch {
    return false;
  }
};

export const getDemoAuth = () => {
  try {
    const demoAuth = localStorage.getItem("demoAuth");
    return demoAuth ? JSON.parse(demoAuth) : null;
  } catch {
    return null;
  }
};

export const setDemoMode = (enabled: boolean) => {
  if (enabled) {
    localStorage.setItem(
      "demoAuth",
      JSON.stringify({
        isAuthenticated: true,
        isArtisan: true,
        user: demoUser,
      })
    );
  } else {
    localStorage.removeItem("demoAuth");
  }
};

// Get demo data for specific pages
export const getDemoProductsForArtisan = (
  artisanId: string = "artisan-001"
) => {
  return demoProducts.filter(
    (product) =>
      product.artisan === demoArtisans.find((a) => a.id === artisanId)?.name
  );
};

export const getDemoOrdersForArtisan = (artisanId: string = "artisan-001") => {
  const artisanProducts = getDemoProductsForArtisan(artisanId);
  const productIds = artisanProducts.map((p) => p.id);
  return demoOrders.filter((order) => productIds.includes(order.productId));
};
