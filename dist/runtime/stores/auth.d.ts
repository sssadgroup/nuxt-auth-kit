import type { AuthUser } from '../types/index.js';
export declare const useAuthStore: import("pinia").StoreDefinition<"nuxt-auth-kit", Pick<{
    user: import("vue").Ref<any, any>;
    token: import("vue").Ref<string | null, string | null>;
    loading: import("vue").Ref<boolean, boolean>;
    isAuthenticated: import("vue").ComputedRef<boolean>;
    isGuest: import("vue").ComputedRef<boolean>;
    hasRole: (role: string | string[]) => boolean;
    hasPermission: (permission: string | string[]) => boolean;
    setUser: (userData: AuthUser) => void;
    setToken: (tokenValue: string) => void;
    clearAuth: () => void;
    setLoading: (state: boolean) => void;
}, "user" | "token" | "loading">, Pick<{
    user: import("vue").Ref<any, any>;
    token: import("vue").Ref<string | null, string | null>;
    loading: import("vue").Ref<boolean, boolean>;
    isAuthenticated: import("vue").ComputedRef<boolean>;
    isGuest: import("vue").ComputedRef<boolean>;
    hasRole: (role: string | string[]) => boolean;
    hasPermission: (permission: string | string[]) => boolean;
    setUser: (userData: AuthUser) => void;
    setToken: (tokenValue: string) => void;
    clearAuth: () => void;
    setLoading: (state: boolean) => void;
}, "isAuthenticated" | "isGuest">, Pick<{
    user: import("vue").Ref<any, any>;
    token: import("vue").Ref<string | null, string | null>;
    loading: import("vue").Ref<boolean, boolean>;
    isAuthenticated: import("vue").ComputedRef<boolean>;
    isGuest: import("vue").ComputedRef<boolean>;
    hasRole: (role: string | string[]) => boolean;
    hasPermission: (permission: string | string[]) => boolean;
    setUser: (userData: AuthUser) => void;
    setToken: (tokenValue: string) => void;
    clearAuth: () => void;
    setLoading: (state: boolean) => void;
}, "hasRole" | "hasPermission" | "setUser" | "setToken" | "clearAuth" | "setLoading">>;
