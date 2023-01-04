// Access token generation/validation config
export const AccessJwtOps = {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXP,
} as const

export const AccessPaylaod = {
    iss: process.env.JWT_ISS,
    aud: process.env.JWT_AUD?.split(', '),
    exp: parseInt(process.env.JWT_ACCESS_TOKEN_EXP),
} as const


// Refresh token generation/validation config
export const RefreshJwtOps = {
    secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXP,
} as const

export const RefreshPayload = {
    iss: process.env.JWT_ISS,
    aud: process.env.JWT_AUD?.split(', '),
    exp: parseInt(process.env.JWT_REFRESH_TOKEN_EXP),
} as const