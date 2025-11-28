export interface Food {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  isAvailable: boolean;
  tags: string[];
  preparationTime: number;
  calories?: number;
  allergens: string[];
}

export interface FoodFormData {
  name: string;
  category: string;
  price: string;
  description: string;
  isAvailable: boolean;
  tags: string[];
  preparationTime: string;
  calories: string;
  allergens: string[];
}
