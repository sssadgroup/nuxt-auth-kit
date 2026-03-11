import type { LoginCredentials, RegisterData, UpdateProfileData, UpdatePasswordData, ForgotPasswordData, ResetPasswordData, ApiError } from '../types/index.js';
export declare function useAuth(): {
    user: any;
    token: any;
    loading: any;
    isAuthenticated: any;
    isGuest: any;
    hasRole: any;
    hasPermission: any;
    login: (credentials: LoginCredentials) => Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: ApiError;
    }>;
    register: (data: RegisterData) => Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: ApiError;
    }>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<any>;
    updateProfile: (data: UpdateProfileData) => Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: ApiError;
    }>;
    updatePassword: (data: UpdatePasswordData) => Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: ApiError;
    }>;
    forgotPassword: (data: ForgotPasswordData) => Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: ApiError;
        message?: undefined;
    }>;
    resetPassword: (data: ResetPasswordData) => Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: ApiError;
        message?: undefined;
    }>;
};
