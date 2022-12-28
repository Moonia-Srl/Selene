import { config } from 'dotenv';
import { getEnvPath } from 'src/helper/env.helper';

export const getAuthConfig = () => {
  const envFilePath: string = getEnvPath(`${__dirname}/../../../environment`);
  config({ path: envFilePath });

  return {
    // Access token generation/validation config
    accessToken: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      jwtPayload: {
        iss: process.env.JWT_ISS,
        aud: process.env.JWT_AUD?.split(', '),
        exp: parseInt(process.env.JWT_ACCESS_TOKEN_EXP),
      },
    },

    // Refresh token generation/validation config
    refreshToken: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      jwtPayload: {
        iss: process.env.JWT_ISS,
        aud: process.env.JWT_AUD?.split(', '),
        exp: parseInt(process.env.JWT_REFRESH_TOKEN_EXP),
      },
    },
  };
};
