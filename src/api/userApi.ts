import axiosInstance from "./axiosInstance";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface AdoptionResponse {
    message: string;
    adoption: {
        _id: string;
        pet: {
            name: string;
            breed: string;
            [key: string]: unknown;
        };
        status: string;
        adoptedAt: string;
    };
}

export interface UserAdoptionRequest {
    _id: string;
    pet: {
        _id: string;
        name: string;
        breed: string;
        image: string;
        status: string;
    };
    status: "pending" | "approved" | "rejected" | "withdrawn";
    createdAt: string;
}

// ─── API Calls ──────────────────────────────────────────────────────────────
export const adoptPet = async (petId: string): Promise<AdoptionResponse> => {
    const response = await axiosInstance.post<AdoptionResponse>("/users/adopt", { petId });
    return response.data;
};

export const getUserAdoptions = async (): Promise<UserAdoptionRequest[]> => {
    const response = await axiosInstance.get<UserAdoptionRequest[]>("/users/adoptions");
    return response.data;
};

export const withdrawAdoption = async (adoptionId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/users/adoptions/${adoptionId}`);
    return response.data;
};
