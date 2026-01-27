const Tesseract = require('tesseract.js');
const natural = require('natural');
const Solution = require('../models/Solution');

// Extract text from image using OCR
exports.extractTextFromImage = async (imagePath) => {
  try {
    if (!imagePath) {
      throw new Error('Image path is required');
    }
    
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => {
        // Only log important messages
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });
    
    return text.trim() || '';
  } catch (error) {
    console.error('OCR Error:', error.message);
    // Return empty string instead of throwing to allow the process to continue
    return '';
  }
};

// Calculate similarity between two texts
const calculateSimilarity = (text1, text2) => {
  const tokenizer = new natural.WordTokenizer();
  const tokens1 = tokenizer.tokenize(text1.toLowerCase());
  const tokens2 = tokenizer.tokenize(text2.toLowerCase());
  
  if (!tokens1 || !tokens2 || tokens1.length === 0 || tokens2.length === 0) {
    return 0;
  }

  // Use Jaccard similarity
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

// Find matching solutions
exports.findMatchingSolution = async (doubtText, threshold = 0.6) => {
  try {
    // Search both text and video solutions
    const solutions = await Solution.find()
      .populate('doubt')
      .limit(100);

    let bestMatch = null;
    let bestScore = 0;

    for (const solution of solutions) {
      let contentScore = 0;
      
      // For text solutions, compare content
      if (solution.type === 'text' && solution.content) {
        contentScore = calculateSimilarity(doubtText, solution.content);
      }
      
      // Compare with original doubt text if available
      let doubtScore = 0;
      if (solution.doubt && solution.doubt.extractedText) {
        doubtScore = calculateSimilarity(doubtText, solution.doubt.extractedText);
      }

      // For video solutions, compare with original doubt
      const score = Math.max(contentScore, doubtScore);

      if (score > bestScore && score >= threshold) {
        bestScore = score;
        bestMatch = solution;
      }
    }

    return bestMatch;
  } catch (error) {
    console.error('Matching Error:', error);
    return null;
  }
};
