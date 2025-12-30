import { Product } from '@/lib/types';

// Reference products (user can select from these)
export const referenceProducts: Product[] = [
  {
    asin: 'B07FVTJWWF',
    title: 'Hydro Flask 32oz Wide Mouth Water Bottle',
    price: 44.95,
    rating: 4.8,
    reviews: 52341,
    category: 'Water Bottles',
  },
  {
    asin: 'B08JQN4JJN',
    title: 'YETI Rambler 26oz Bottle with Chug Cap',
    price: 40.00,
    rating: 4.7,
    reviews: 28934,
    category: 'Water Bottles',
  },
  {
    asin: 'B07RNXY24P',
    title: 'Stanley Classic Trigger-Action Travel Mug 20oz',
    price: 25.00,
    rating: 4.6,
    reviews: 18234,
    category: 'Travel Mugs',
  },
  {
    asin: 'B09NVBLP3G',
    title: 'Owala FreeSip Stainless Steel Water Bottle 24oz',
    price: 27.99,
    rating: 4.7,
    reviews: 45678,
    category: 'Water Bottles',
  },
  {
    asin: 'B08QZBN2BH',
    title: 'CamelBak Eddy+ Vacuum Insulated 25oz',
    price: 34.00,
    rating: 4.5,
    reviews: 12345,
    category: 'Water Bottles',
  },
];

// 50 mock competitor products
export const generateMockCompetitors = (referenceProduct: Product): Product[] => {
  const basePrice = referenceProduct.price;
  
  // High quality competitors (15) - should pass most filters
  const highQuality: Product[] = [
    { asin: 'C001', title: 'ThermoFlask 32oz Insulated Stainless Steel', price: basePrice * 0.8, rating: 4.6, reviews: 8932, category: 'Water Bottles' },
    { asin: 'C002', title: 'Simple Modern Summit 32oz Water Bottle', price: basePrice * 0.7, rating: 4.7, reviews: 15234, category: 'Water Bottles' },
    { asin: 'C003', title: 'Iron Flask Sports Water Bottle 32oz', price: basePrice * 0.65, rating: 4.5, reviews: 22341, category: 'Water Bottles' },
    { asin: 'C004', title: 'Contigo Autoseal Chill 24oz', price: basePrice * 0.55, rating: 4.4, reviews: 9876, category: 'Water Bottles' },
    { asin: 'C005', title: 'Takeya Actives Insulated 32oz', price: basePrice * 0.9, rating: 4.6, reviews: 7654, category: 'Water Bottles' },
    { asin: 'C006', title: 'Klean Kanteen Classic 27oz', price: basePrice * 0.75, rating: 4.5, reviews: 5432, category: 'Water Bottles' },
    { asin: 'C007', title: 'Nalgene Wide Mouth 32oz BPA-Free', price: basePrice * 0.4, rating: 4.7, reviews: 34567, category: 'Water Bottles' },
    { asin: 'C008', title: 'Zojirushi Stainless Steel Mug 20oz', price: basePrice * 0.85, rating: 4.8, reviews: 4321, category: 'Water Bottles' },
    { asin: 'C009', title: 'Polar Bottle Sport Insulated 24oz', price: basePrice * 0.5, rating: 4.3, reviews: 2345, category: 'Water Bottles' },
    { asin: 'C010', title: 'CamelBak Chute Mag 32oz', price: basePrice * 0.6, rating: 4.5, reviews: 6789, category: 'Water Bottles' },
    { asin: 'C011', title: 'Thermos Stainless King 24oz', price: basePrice * 0.7, rating: 4.4, reviews: 3456, category: 'Water Bottles' },
    { asin: 'C012', title: 'Mira Stainless Steel Vacuum 32oz', price: basePrice * 0.55, rating: 4.3, reviews: 8765, category: 'Water Bottles' },
    { asin: 'C013', title: 'S\'well Triple-Layered 25oz', price: basePrice * 1.1, rating: 4.6, reviews: 12345, category: 'Water Bottles' },
    { asin: 'C014', title: 'Fifty/Fifty Vacuum Insulated 34oz', price: basePrice * 0.65, rating: 4.4, reviews: 2134, category: 'Water Bottles' },
    { asin: 'C015', title: 'EcoVessel Summit Triple Insulated 24oz', price: basePrice * 0.8, rating: 4.5, reviews: 1876, category: 'Water Bottles' },
  ];

  // Low quality/cheap (20) - should fail filters
  const lowQuality: Product[] = [
    { asin: 'L001', title: 'Generic Plastic Water Bottle 16oz', price: basePrice * 0.15, rating: 3.2, reviews: 45, category: 'Water Bottles' },
    { asin: 'L002', title: 'Budget Sport Bottle 20oz', price: basePrice * 0.2, rating: 3.5, reviews: 78, category: 'Water Bottles' },
    { asin: 'L003', title: 'No-Name Steel Bottle 24oz', price: basePrice * 0.25, rating: 3.1, reviews: 23, category: 'Water Bottles' },
    { asin: 'L004', title: 'Cheap Insulated Flask 32oz', price: basePrice * 0.18, rating: 2.9, reviews: 156, category: 'Water Bottles' },
    { asin: 'L005', title: 'Dollar Store Water Container', price: basePrice * 0.1, rating: 2.5, reviews: 12, category: 'Water Bottles' },
    { asin: 'L006', title: 'Basic Aluminum Bottle 20oz', price: basePrice * 0.22, rating: 3.4, reviews: 89, category: 'Water Bottles' },
    { asin: 'L007', title: 'Economy Plastic Jug 1L', price: basePrice * 0.12, rating: 3.0, reviews: 34, category: 'Water Bottles' },
    { asin: 'L008', title: 'Unbranded Sports Flask', price: basePrice * 0.28, rating: 3.6, reviews: 67, category: 'Water Bottles' },
    { asin: 'L009', title: 'Clearance Bin Bottle 24oz', price: basePrice * 0.15, rating: 2.8, reviews: 19, category: 'Water Bottles' },
    { asin: 'L010', title: 'Bulk Pack Water Bottle Set', price: basePrice * 0.3, rating: 3.3, reviews: 234, category: 'Water Bottles' },
    { asin: 'L011', title: 'Flimsymax Ultra Light 18oz', price: basePrice * 0.2, rating: 3.7, reviews: 56, category: 'Water Bottles' },
    { asin: 'L012', title: 'QuickMart House Brand 22oz', price: basePrice * 0.18, rating: 3.2, reviews: 41, category: 'Water Bottles' },
    { asin: 'L013', title: 'Import Special Steel 26oz', price: basePrice * 0.25, rating: 2.7, reviews: 28, category: 'Water Bottles' },
    { asin: 'L014', title: 'Gas Station Promo Bottle', price: basePrice * 0.08, rating: 2.4, reviews: 8, category: 'Water Bottles' },
    { asin: 'L015', title: 'Warehouse Club 3-Pack', price: basePrice * 0.35, rating: 3.5, reviews: 178, category: 'Water Bottles' },
    { asin: 'L016', title: 'AmazonBasics Water Bottle', price: basePrice * 0.3, rating: 3.8, reviews: 89, category: 'Water Bottles' },
    { asin: 'L017', title: 'Discount Steel Thermos', price: basePrice * 0.22, rating: 3.4, reviews: 45, category: 'Water Bottles' },
    { asin: 'L018', title: 'Party Favor Bottles 10pk', price: basePrice * 0.05, rating: 2.1, reviews: 15, category: 'Water Bottles' },
    { asin: 'L019', title: 'School Fundraiser Bottle', price: basePrice * 0.2, rating: 3.6, reviews: 92, category: 'Water Bottles' },
    { asin: 'L020', title: 'Budget King Flask 28oz', price: basePrice * 0.28, rating: 3.3, reviews: 67, category: 'Water Bottles' },
  ];

  // Accessories (10) - should fail relevance
  const accessories: Product[] = [
    { asin: 'A001', title: 'Bottle Brush Cleaning Kit 3-Pack', price: 9.99, rating: 4.5, reviews: 2345, category: 'Accessories' },
    { asin: 'A002', title: 'Replacement Lid for Wide Mouth', price: 8.99, rating: 4.2, reviews: 1234, category: 'Accessories' },
    { asin: 'A003', title: 'Paracord Bottle Carrier Strap', price: 12.99, rating: 4.4, reviews: 876, category: 'Accessories' },
    { asin: 'A004', title: 'Insulated Bottle Sleeve 32oz', price: 14.99, rating: 4.3, reviews: 543, category: 'Accessories' },
    { asin: 'A005', title: 'Straw Lid Replacement Set', price: 11.99, rating: 4.1, reviews: 432, category: 'Accessories' },
    { asin: 'A006', title: 'Bottle Drying Rack Stand', price: 19.99, rating: 4.6, reviews: 765, category: 'Accessories' },
    { asin: 'A007', title: 'Carabiner Clip for Bottles', price: 5.99, rating: 4.0, reviews: 321, category: 'Accessories' },
    { asin: 'A008', title: 'Silicone Boot Protector', price: 7.99, rating: 4.3, reviews: 654, category: 'Accessories' },
    { asin: 'A009', title: 'Cleaning Tablets 24-Pack', price: 10.99, rating: 4.5, reviews: 1098, category: 'Accessories' },
    { asin: 'A010', title: 'Flip Lid Conversion Kit', price: 13.99, rating: 4.2, reviews: 234, category: 'Accessories' },
  ];

  // Premium bottles (5) - should fail price filters
  const premium: Product[] = [
    { asin: 'P001', title: 'YETI Rambler One Gallon Jug', price: basePrice * 2.5, rating: 4.9, reviews: 3456, category: 'Water Bottles' },
    { asin: 'P002', title: 'Hydro Flask Trail Series 32oz', price: basePrice * 2.2, rating: 4.8, reviews: 1234, category: 'Water Bottles' },
    { asin: 'P003', title: 'Corkcicle Luxe Copper 25oz', price: basePrice * 2.8, rating: 4.7, reviews: 876, category: 'Water Bottles' },
    { asin: 'P004', title: 'Miir Howler 64oz Growler', price: basePrice * 3.0, rating: 4.6, reviews: 543, category: 'Water Bottles' },
    { asin: 'P005', title: 'BKR Glass + Silicone Limited Ed', price: basePrice * 2.4, rating: 4.5, reviews: 321, category: 'Water Bottles' },
  ];

  return [...highQuality, ...lowQuality, ...accessories, ...premium];
};
