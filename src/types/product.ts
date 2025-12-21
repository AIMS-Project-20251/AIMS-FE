export type ProductType = "BOOK" | "CD" | "DVD" | "NEWSPAPER";

export interface BookAttributes {
  authors?: string;
  coverType?: "PAPERBACK" | "HARDCOVER";
  publisher?: string;
  publicationDate?: string;
  pages?: number;
  language?: string;
  genre?: string;
}

export interface CDAttributes {
  artists?: string;
  recordLabel?: string;
  tracks?: Array<{ title: string; length: string }>;
  genre?: string;
  releaseDate?: string;
}

export interface DVDAttributes {
  discType?: "BLURAY" | "HD_DVD";
  director?: string;
  runtime?: string;
  studio?: string;
  language?: string;
  subtitles?: string[];
  releaseDate?: string;
  genre?: string;
}

export interface NewspaperAttributes {
  editorInChief?: string;
  publisher?: string;
  publicationDate?: string;
  issueNumber?: string;
  publicationFrequency?: string;
  issn?: string;
  language?: string;
  sections?: string[];
}

export type AllProductAttributes = BookAttributes &
  CDAttributes &
  DVDAttributes &
  NewspaperAttributes;

export interface Product extends AllProductAttributes {
  id: number;
  title: string;
  category: string;
  originalValue: number;
  currentPrice: number;
  quantity: number;
  weight: number;
  imageUrl: string;
  type: ProductType;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto
  extends Omit<Product, "id" | "isActive" | "createdAt" | "updatedAt"> {}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
