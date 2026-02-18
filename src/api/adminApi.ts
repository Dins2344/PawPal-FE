import axiosInstance from "./axiosInstance";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface Pet {
    _id: string;
    name: string;
    breed: string;
    age: number;
    species: string;
    gender: string;
    description: string;
    image: string;
    status: string;
    createdAt: string;
}

export interface AdoptionRequest {
    _id: string;
    user: {
        _id: string;
        fullName: string;
        email: string;
        phone: string;
    };
    pet: {
        _id: string;
        name: string;
        breed: string;
        image: string;
    };
    status: "pending" | "approved" | "rejected";
    createdAt: string;
}

// ─── Pet API Calls ──────────────────────────────────────────────────────────
export const addPet = async (formData: FormData): Promise<{ message: string; pet: Pet }> => {
    const response = await axiosInstance.post("/admin/pets", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updatePet = async (petId: string, formData: FormData): Promise<{ message: string; pet: Pet }> => {
    const response = await axiosInstance.put(`/admin/pets/${petId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getAllPets = async (): Promise<Pet[]> => {
    const response = await axiosInstance.get("/admin/pets");
    return response.data;
};

export const deletePet = async (petId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/admin/pets/${petId}`);
    return response.data;
};

// ─── Adoption Request API Calls ─────────────────────────────────────────────
export const getAdoptionRequests = async (): Promise<AdoptionRequest[]> => {
    const response = await axiosInstance.get("/admin/adoptions");
    return response.data;
};

export const approveAdoption = async (adoptionId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.put(`/admin/adoptions/${adoptionId}/approve`);
    return response.data;
};

export const rejectAdoption = async (adoptionId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.put(`/admin/adoptions/${adoptionId}/reject`);
    return response.data;
};
