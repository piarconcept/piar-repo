export const isLocal = process.env.APP_ENV === 'local';

export interface EnvParams {
  environment: string;
  isProduction: boolean;
  app: {
    port: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export const loadConfigurationParams = () => {
  const isProduction =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod';

  const config = {
    environment: process.env.NODE_ENV || 'local',
    isProduction,
    app: {
      port: parseInt(process.env.PORT as string, 10) || 4000,
    },
    mongoDBconfig: {
      database_url: process.env.DATABASE_URL,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  };

  return config;
};
