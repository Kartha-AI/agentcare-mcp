export interface AuthConfig {
    clientId: string;
    clientSecret: string;
    tokenHost: string;
    authorizePath: string;
    authorizationMethod: 'body' | 'header';
    tokenPath: string;
    audience: string;
    callbackURL: string;
    scopes: string;
    callbackPort: number;
}

export interface Token {
    access_token: string;
    refresh_token: string;
    expires_at: Date;
}