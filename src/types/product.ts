export type ProductType = "BOOK" | "CD" | "DVD" | "NEWSPAPER";

export interface BookAttributes {
  authors: string;
  coverType: "PAPERBACK" | "HARDCOVER";
  publisher: string;
  publicationDate: string;
  pages?: number;
  language?: string;
  genre?: string;
}

export interface CDAttributes {
  artists: string;
  recordLabel: string;
  tracks: Array<{ title: string; length: string }>;
  genre: string;
  releaseDate?: string;
}

export interface DVDAttributes {
  discType: "BLURAY" | "HD_DVD";
  director: string;
  runtime: string;
  studio: string;
  language: string;
  subtitles: string[];
  releaseDate?: string;
  genre?: string;
}

export interface NewspaperAttributes {
  editorInChief: string;
  publisher: string;
  publicationDate: string;
  issueNumber?: string;
  publicationFrequency?: string;
  issn?: string;
  language?: string;
  sections?: string[];
}

export type ProductAttributes =
  | BookAttributes
  | CDAttributes
  | DVDAttributes
  | NewspaperAttributes;

export interface Product {
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
  attributes: ProductAttributes;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto
  extends Omit<
    Product,
    "id" | "isActive" | "createdAt" | "updatedAt" | "attributes"
  > {
  attributes: ProductAttributes;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
