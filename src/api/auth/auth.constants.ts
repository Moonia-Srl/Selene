
export const GetAccessTokenData = () => {
    // Access token generation/validation config
    const AccessPayload = {
        iss: process.env.JWT_ISS,
        aud: process.env.JWT_AUD?.split(', '),
        exp: parseInt(process.env.JWT_ACCESS_TOKEN_EXP),
    }
    
    const AccessJwtOps = {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET
    }
    
    return [AccessPayload, AccessJwtOps] as const
}


export const GetRefreshTokenData = () => {
    // Refresh token generation/validation config
    const RefreshPayload = {
        iss: process.env.JWT_ISS,
        aud: process.env.JWT_AUD?.split(', '),
        exp: parseInt(process.env.JWT_REFRESH_TOKEN_EXP),
    } 
    
    const RefreshJwtOps = {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET
    }

    return [RefreshPayload, RefreshJwtOps] as const
}