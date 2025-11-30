export interface Product {
  id: number;
  title: string;
  category: string;
  originalValue: number;
  currentPrice: number;
  quantity: number;
  weight: number;
  imageUrl: string;
  type: "BOOK" | "CD" | "DVD" | "LP";
  isActive: boolean;
}

export interface CreateProductDto extends Omit<Product, "id" | "isActive"> {}
export interface UpdateProductDto extends Partial<CreateProductDto> {}
