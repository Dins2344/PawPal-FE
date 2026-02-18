import axiosInstance from "./axiosInstance";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        _id: string;
        fullName: string;
        email: string;
        phone: string;
        role: "admin" | "user";
    };
}

// ─── API Calls ──────────────────────────────────────────────────────────────
export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", payload);
    return response.data;
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/auth/register", payload);
    return response.data;
};

export const getMe = async (): Promise<AuthResponse["user"]> => {
    const response = await axiosInstance.get<AuthResponse["user"]>("/auth/me");
    return response.data;
};
