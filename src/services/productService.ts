import axiosClient from "../api/axiosClient";
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from "../types/product";

export const productService = {
  getAll: async (search?: string): Promise<Product[]> => {
    const response = await axiosClient.get("/products", {
      params: { search },
    });
    return response.data;
  },

  getOne: async (id: number): Promise<Product> => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await axiosClient.post("/products", data);
    return response.data;
  },

  update: async (id: number, data: UpdateProductDto): Promise<Product> => {
    const response = await axiosClient.patch(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/products/${id}`);
  },
};
