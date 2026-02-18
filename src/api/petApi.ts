import axiosInstance from "./axiosInstance";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface Pet {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    gender: string;
    description: string;
    image: string;
    status: string;
    createdAt: string;
}

export interface PetFilters {
    search?: string;
    species?: string;
    breed?: string;
    age?: string;
}

// ─── API Calls ──────────────────────────────────────────────────────────────
export const getAllPets = async (filters?: PetFilters): Promise<Pet[]> => {
    const params: Record<string, string> = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.species && filters.species !== "All") params.species = filters.species;
    if (filters?.breed && filters.breed !== "All") params.breed = filters.breed;
    if (filters?.age) params.age = filters.age;

    const response = await axiosInstance.get<Pet[]>("/pets", { params });
    return response.data;
};

export const getPetById = async (id: string): Promise<Pet> => {
    const response = await axiosInstance.get<Pet>(`/pets/${id}`);
    return response.data;
};

export const getBreeds = async (): Promise<string[]> => {
    const response = await axiosInstance.get<string[]>("/pets/breeds");
    return response.data;
};
