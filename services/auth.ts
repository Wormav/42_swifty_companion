import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {API_CONFIG} from '../constants/config';
import {storage} from './storage';

// Required for expo-auth-session to work properly
WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = process.env.EXPO_PUBLIC_42_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_42_CLIENT_SECRET;
const REDIRECT_URI =
    process.env.EXPO_PUBLIC_42_REDIRECT_URI || 'swiftycompanion://oauth';

// Discovery document for 42 API OAuth2
const discovery: AuthSession.DiscoveryDocument = {
    authorizationEndpoint: API_CONFIG.AUTH_URL,
    tokenEndpoint: API_CONFIG.TOKEN_URL,
};

export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string | null;
    scope: string;
    created_at: number;
}

export const auth = {
    /**
     * Create an auth request with PKCE
     */
    createAuthRequest(): AuthSession.AuthRequest {
        return new AuthSession.AuthRequest({
            clientId: CLIENT_ID!,
            scopes: API_CONFIG.SCOPES,
            redirectUri: REDIRECT_URI,
            usePKCE: true,
        });
    },

    /**
     * Start the OAuth2 login flow
     */
    async login(): Promise<TokenResponse | null> {
        if (!CLIENT_ID || !CLIENT_SECRET) {
            throw new Error(
                'Missing EXPO_PUBLIC_42_CLIENT_ID or EXPO_PUBLIC_42_CLIENT_SECRET in environment variables'
            );
        }

        const request = this.createAuthRequest();
        const result = await request.promptAsync(discovery);

        if (result.type !== 'success' || !result.params.code) {
            return null;
        }

        // Exchange authorization code for tokens
        const tokenResponse = await this.exchangeCodeForToken(
            result.params.code,
            request.codeVerifier!
        );

        if (tokenResponse) {
            await storage.saveTokens(
                tokenResponse.access_token,
                tokenResponse.refresh_token,
                tokenResponse.expires_in
            );
        }

        return tokenResponse;
    },

    /**
     * Exchange authorization code for access token
     */
    async exchangeCodeForToken(
        code: string,
        codeVerifier: string
    ): Promise<TokenResponse | null> {
        try {
            const response = await fetch(API_CONFIG.TOKEN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: CLIENT_ID!,
                    client_secret: CLIENT_SECRET!,
                    code,
                    redirect_uri: REDIRECT_URI,
                    code_verifier: codeVerifier,
                }).toString(),
            });

            if (!response.ok) {
                const error = await response.text();
                console.error('Token exchange failed:', error);
                return null;
            }

            return response.json();
        } catch (error) {
            console.error('Token exchange error:', error);
            return null;
        }
    },

    /**
     * Refresh the access token using refresh token
     */
    async refreshAccessToken(): Promise<TokenResponse | null> {
        const refreshToken = await storage.getRefreshToken();

        if (!refreshToken) {
            return null;
        }

        try {
            const response = await fetch(API_CONFIG.TOKEN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    client_id: CLIENT_ID!,
                    client_secret: CLIENT_SECRET!,
                    refresh_token: refreshToken,
                }).toString(),
            });

            if (!response.ok) {
                // Refresh token invalid, clear tokens
                await storage.clearTokens();
                return null;
            }

            const tokenResponse: TokenResponse = await response.json();

            await storage.saveTokens(
                tokenResponse.access_token,
                tokenResponse.refresh_token,
                tokenResponse.expires_in
            );

            return tokenResponse;
        } catch (error) {
            console.error('Token refresh error:', error);
            return null;
        }
    },

    /**
     * Get a valid access token, refreshing if necessary
     */
    async getValidToken(): Promise<string | null> {
        const isExpired = await storage.isTokenExpired();

        if (isExpired) {
            const refreshed = await this.refreshAccessToken();
            if (!refreshed) {
                return null;
            }
        }

        return storage.getAccessToken();
    },

    /**
     * Logout and clear all tokens
     */
    async logout(): Promise<void> {
        await storage.clearTokens();
    },
};
