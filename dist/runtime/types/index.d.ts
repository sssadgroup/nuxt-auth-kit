export interface AuthUser {
    id: number | string;
    name: string;
    email: string;
    avatar?: string;
    roles?: string[];
    permissions?: string[];
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}
export interface LoginCredentials {
    email: string;
    password: string;
    remember?: boolean;
}
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: string;
    [key: string]: unknown;
}
export interface UpdateProfileData {
    name?: string;
    email?: string;
    avatar?: File | string | null;
    [key: string]: unknown;
}
export interface UpdatePasswordData {
    current_password: string;
    password: string;
    password_confirmation: string;
}
export interface ForgotPasswordData {
    email: string;
}
export interface ResetPasswordData {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}
export interface AuthResponse {
    user: AuthUser;
    token: string;
    token_type?: string;
    expires_in?: number;
}
export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}
export interface ModuleOptions {
    /** Laravel API base URL */
    apiBase: string;
    /** API endpoints (customizable) */
    endpoints?: {
        login?: string;
        register?: string;
        logout?: string;
        me?: string;
        updateProfile?: string;
        updatePassword?: string;
        forgotPassword?: string;
        resetPassword?: string;
    };
    /** Token storage strategy */
    tokenStorage?: 'cookie' | 'localStorage';
    /** Cookie name for token */
    tokenCookieName?: string;
    /** Redirect routes */
    redirects?: {
        login?: string;
        home?: string;
        afterLogout?: string;
    };
    /** Role-based access control */
    rbac?: {
        superAdminRole?: string;
        defaultUserRole?: string;
    };
}
