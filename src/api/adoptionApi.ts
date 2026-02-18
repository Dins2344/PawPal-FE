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

// ─── API Calls ──────────────────────────────────────────────────────────────
export const adoptPet = async (petId: string): Promise<AdoptionResponse> => {
    const response = await axiosInstance.post<AdoptionResponse>("/users/adopt", { petId });
    return response.data;
};
