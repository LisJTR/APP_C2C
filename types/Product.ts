// types/Product.ts
export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    size: string;
    image_url: string;
    condition: string;
    brand: string;
    category: string;
    user_id: number; 
     images?: string[]; 
  }
  