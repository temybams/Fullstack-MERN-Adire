const config = {
  production: {
    apiUrl: 'https://adire-cgms.onrender.com',
    clientUrl: 'https://adire1.vercel.app',
  },
  development: {
    apiUrl: 'http://127.0.0.1:3000',
    clientUrl: 'http://localhost:5173',
  },
};

// Check if the environment is production or development

const isProduction = process.env.NODE_ENV === 'production';

export const apiUrl = isProduction
  ? config.production.apiUrl
  : config.development.apiUrl;

export const clientUrl = isProduction
  ? config.production.clientUrl
  : config.development.clientUrl;
