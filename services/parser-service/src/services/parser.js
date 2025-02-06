const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

class ParserService {
  async parseResume(fileBuffer, fileType) {
    let text;
    
    switch (fileType.toLowerCase()) {
      case 'application/pdf':
        text = await this.parsePDF(fileBuffer);
        break;
      case 'application/docx':
        text = await this.parseDocx(fileBuffer);
        break;
      default:
        throw new Error('Unsupported file type');
    }

    return this.extractStructuredData(text);
  }

  async parsePDF(buffer) {
    const data = await pdfParse(buffer);
    return data.text;
  }

  async parseDocx(buffer) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  async parseText(text) {
    return this.extractStructuredData(text);
  }

  extractStructuredData(text) {
    // Basic structured data extraction
    const sections = {
      contact: this.extractContactInfo(text),
      education: this.extractEducation(text),
      experience: this.extractExperience(text),
      skills: this.extractSkills(text)
    };

    return sections;
  }

  extractContactInfo(text) {
    // Basic regex patterns for contact information
    const emailPattern = /[\w.-]+@[\w.-]+\.\w+/g;
    const phonePattern = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;

    return {
      email: text.match(emailPattern)?.[0] || null,
      phone: text.match(phonePattern)?.[0] || null
    };
  }

  extractEducation(text) {
    // Basic education extraction logic
    const educationKeywords = ['education', 'university', 'college', 'degree', 'bachelor', 'master'];
    const sentences = text.split(/[.!?]+/);
    
    return sentences
      .filter(sentence => 
        educationKeywords.some(keyword => 
          sentence.toLowerCase().includes(keyword)
        )
      )
      .map(sentence => sentence.trim());
  }

  extractExperience(text) {
    // Basic work experience extraction logic
    const experienceKeywords = ['experience', 'work', 'employment', 'job', 'position'];
    const sentences = text.split(/[.!?]+/);
    
    return sentences
      .filter(sentence => 
        experienceKeywords.some(keyword => 
          sentence.toLowerCase().includes(keyword)
        )
      )
      .map(sentence => sentence.trim());
  }

  extractSkills(text) {
    // Basic skills extraction using tokenization
    const tokens = tokenizer.tokenize(text);
    const commonSkills = [
      'javascript', 'python', 'java', 'sql', 'react', 'node',
      'management', 'leadership', 'communication', 'analysis'
    ];
    
    return tokens
      .filter(token => 
        commonSkills.includes(token.toLowerCase())
      )
      .map(skill => skill.toLowerCase());
  }
}

module.exports = new ParserService(); 