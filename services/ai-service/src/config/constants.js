require('dotenv').config();

module.exports = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  CACHE_TTL: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour in seconds
  MAX_TOKENS: parseInt(process.env.MAX_TOKENS) || 2000,
  MODEL_NAME: process.env.MODEL_NAME || 'gpt-4-turbo-preview'
}; 