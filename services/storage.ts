import * as SecureStore from 'expo-secure-store';

const KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    TOKEN_EXPIRY: 'token_expiry',
};

export const storage = {
    async saveTokens(
        accessToken: string,
        refreshToken: string | null,
        expiresIn: number
    ): Promise<void> {
        const expiryTime = Date.now() + expiresIn * 1000;

        await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken);
        await SecureStore.setItemAsync(KEYS.TOKEN_EXPIRY, expiryTime.toString());

        if (refreshToken) {
            await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken);
        }
    },

    async getAccessToken(): Promise<string | null> {
        return SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
    },

    async getRefreshToken(): Promise<string | null> {
        return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
    },

    async getTokenExpiry(): Promise<number | null> {
        const expiry = await SecureStore.getItemAsync(KEYS.TOKEN_EXPIRY);
        return expiry ? parseInt(expiry, 10) : null;
    },

    async isTokenExpired(): Promise<boolean> {
        const expiry = await this.getTokenExpiry();
        if (!expiry) return true;
        // Consider token expired 5 minutes before actual expiry
        return Date.now() > expiry - 5 * 60 * 1000;
    },

    async clearTokens(): Promise<void> {
        await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
        await SecureStore.deleteItemAsync(KEYS.TOKEN_EXPIRY);
    },
};
