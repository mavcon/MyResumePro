const OpenAI = require('openai');
const { createClient } = require('redis');
const logger = require('../utils/logger');
const { 
  OPENAI_API_KEY, 
  REDIS_URL, 
  CACHE_TTL, 
  MAX_TOKENS,
  MODEL_NAME 
} = require('../config/constants');

class AIService {
  constructor() {
    this.openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    this.redis = createClient({ url: REDIS_URL });
    this.redis.connect().catch(err => logger.error('Redis connection error:', err));
  }

  async rewriteProfile(profile) {
    const cacheKey = `profile:${JSON.stringify(profile)}`;
    
    // Check cache first
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        logger.info('Returning cached profile rewrite');
        return JSON.parse(cached);
      }
    } catch (error) {
      logger.error('Cache error:', error);
    }

    const prompt = this.buildProfilePrompt(profile);
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: MODEL_NAME,
        messages: [
          {
            role: "system",
            content: "You are an expert resume writer following ATS-friendly best practices. Rewrite the profile to be more impactful, using metrics and active voice."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: MAX_TOKENS,
        temperature: 0.7
      });

      const rewrittenProfile = completion.choices[0].message.content;

      // Cache the result
      try {
        await this.redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(rewrittenProfile));
      } catch (error) {
        logger.error('Cache storage error:', error);
      }

      return rewrittenProfile;
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw new Error('Failed to process profile with AI');
    }
  }

  async generateCoverLetter(profile, jobDescription) {
    const cacheKey = `cover:${JSON.stringify({ profile, jobDescription })}`;
    
    // Check cache first
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        logger.info('Returning cached cover letter');
        return JSON.parse(cached);
      }
    } catch (error) {
      logger.error('Cache error:', error);
    }

    const prompt = this.buildCoverLetterPrompt(profile, jobDescription);
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: MODEL_NAME,
        messages: [
          {
            role: "system",
            content: "You are an expert cover letter writer. Create a compelling, personalized cover letter that matches the candidate's experience with the job requirements."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: MAX_TOKENS,
        temperature: 0.7
      });

      const coverLetter = completion.choices[0].message.content;

      // Cache the result
      try {
        await this.redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(coverLetter));
      } catch (error) {
        logger.error('Cache storage error:', error);
      }

      return coverLetter;
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw new Error('Failed to generate cover letter');
    }
  }

  buildProfilePrompt(profile) {
    return `
      Please rewrite the following professional profile using ATS-friendly language,
      active voice, and quantifiable achievements where possible:

      ${JSON.stringify(profile, null, 2)}

      Focus on:
      1. Strong action verbs
      2. Measurable results
      3. Industry-specific keywords
      4. Clear, concise language
    `;
  }

  buildCoverLetterPrompt(profile, jobDescription) {
    return `
      Create a personalized cover letter based on the following profile and job description:

      PROFILE:
      ${JSON.stringify(profile, null, 2)}

      JOB DESCRIPTION:
      ${jobDescription}

      Requirements:
      1. Address key job requirements
      2. Highlight relevant experience
      3. Show enthusiasm and cultural fit
      4. Keep it concise (max 400 words)
    `;
  }
}

module.exports = new AIService(); 