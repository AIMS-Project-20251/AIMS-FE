export interface Product {
  id: number;
  title: string;
  category: string;
  originalValue: number;
  currentPrice: number;
  quantity: number;
  weight: number;
  imageUrl: string;
  type: "BOOK" | "CD" | "DVD" | "NEWSPAPER";
  isActive: boolean;
  attributes?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto
  extends Omit<Product, "id" | "isActive" | "createdAt" | "updatedAt"> {}
export interface UpdateProductDto extends Partial<CreateProductDto> {}
