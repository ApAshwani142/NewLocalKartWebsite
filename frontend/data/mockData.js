export const CATEGORIES = [
  { id: 'Vegetables', name: 'Vegetables', count: 12, icon: '🥦', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=200' },
  { id: 'Fruits', name: 'Fruits', count: 8, icon: '🍎', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=200' },
  { id: 'Dairy & Eggs', name: 'Dairy & Eggs', count: 15, icon: '🥚', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=200' },
  { id: 'Meat & Fish', name: 'Meat & Fish', count: 6, icon: '🍖', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=200' },
  { id: 'Fresh Bread', name: 'Fresh Bread', count: 9, icon: '🍞', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200' },
  { id: 'Snacks', name: 'Snacks', count: 20, icon: '🍿', image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=200' },
  { id: 'Beverages', name: 'Beverages', count: 14, icon: '🥤', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=200' },
  { id: 'Personal Care', name: 'Personal Care', count: 18, icon: '🧴', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=200' },
  { id: 'Home Care', name: 'Home Care', count: 22, icon: '🧹', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=200' },
  { id: 'Organics', name: 'Organics', count: 10, icon: '🌱', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200' }
];

export const PROMOS = [
  {
    id: 1,
    tag: 'MEGA SALE',
    title: 'Fresh Produce Sale',
    desc: 'Top farm picks up to 50% Off',
    btnText: 'SHOP NOW',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 2,
    tag: '30% FLAT DISCOUNT',
    title: 'Organic Juices',
    desc: 'Healthy organic essentials',
    btnText: 'SHOP NOW',
    gradient: 'from-teal-600 to-emerald-500'
  },
  {
    id: 3,
    tag: 'FREE DELIVERY',
    title: 'Same-Hour Shipping',
    desc: 'No shipping fee above ₹200',
    btnText: 'CLAIM FREE',
    gradient: 'from-blue-600 to-indigo-600'
  }
];

export const PRODUCTS = [
  {
    _id: 'prod1',
    name: 'Organic Green Broccoli',
    category: 'Vegetables',
    price: 80,
    originalPrice: 110,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=400',
    rating: 4.8,
    unit: '500g',
    stock: 50
  },
  {
    _id: 'prod2',
    name: 'Fresh Red Tomatoes',
    category: 'Vegetables',
    price: 40,
    originalPrice: 60,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=400',
    rating: 4.6,
    unit: '1 kg',
    stock: 60
  },
  {
    _id: 'prod3',
    name: 'Fresh Potatoes',
    category: 'Vegetables',
    price: 32,
    originalPrice: 40,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=400',
    rating: 4.5,
    unit: '1 kg',
    stock: 100
  },
  {
    _id: 'prod4',
    name: 'Red Delicious Apples',
    category: 'Fruits',
    price: 120,
    originalPrice: 160,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=400',
    rating: 4.7,
    unit: '1 kg',
    stock: 40
  },
  {
    _id: 'prod5',
    name: 'Fresh Milk Bottle',
    category: 'Dairy & Eggs',
    price: 60,
    originalPrice: 65,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=400',
    rating: 4.8,
    unit: '1 L',
    stock: 80
  },
  {
    _id: 'prod6',
    name: 'Farm Fresh Organic Eggs',
    category: 'Dairy & Eggs',
    price: 90,
    originalPrice: 100,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=400',
    rating: 4.9,
    unit: '12 Items',
    stock: 35
  },
  {
    _id: 'prod7',
    name: 'Fresh Tender Chicken Breast',
    category: 'Meat & Fish',
    price: 240,
    originalPrice: 280,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=400',
    rating: 4.7,
    unit: '1 kg',
    stock: 20
  },
  {
    _id: 'prod8',
    name: 'Whole Wheat Sandwich Bread',
    category: 'Fresh Bread',
    price: 45,
    originalPrice: 50,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400',
    rating: 4.4,
    unit: '400g',
    stock: 30
  },
  {
    _id: 'prod9',
    name: 'Salted Popcorn Pack',
    category: 'Snacks',
    price: 50,
    originalPrice: 60,
    discount: 16,
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=400',
    rating: 4.5,
    unit: '150g',
    stock: 120
  },
  {
    _id: 'prod10',
    name: 'Pure Orange Juice Bottle',
    category: 'Beverages',
    price: 90,
    originalPrice: 130,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=400',
    rating: 4.8,
    unit: '1 L',
    stock: 60,
    isTrending: true,
    isDealOfTheDay: true
  },
  {
    _id: 'prod11',
    name: 'Pressed Apple Juice',
    category: 'Beverages',
    price: 105,
    originalPrice: 150,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?q=80&w=400',
    rating: 4.7,
    unit: '1 L',
    stock: 50,
    isTrending: true,
    isDealOfTheDay: true
  },
  {
    _id: 'prod12',
    name: 'Organic Pomegranate Juice',
    category: 'Beverages',
    price: 120,
    originalPrice: 170,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1620992770674-133e09483855?q=80&w=400',
    rating: 4.9,
    unit: '1 L',
    stock: 40,
    isTrending: true,
    isDealOfTheDay: true
  }
];
