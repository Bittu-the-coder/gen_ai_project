// Mock AI service for demonstration purposes
// In production, replace with actual Google Cloud AI services

class AIService {
  /**
   * Transcribe audio to text
   * @param {Buffer} audioBuffer - Audio file buffer
   * @param {string} contentType - Audio content type
   * @returns {Promise<{transcript: string, confidence: number}>}
   */
  async transcribeAudio(audioBuffer, contentType) {
    try {
      // Mock implementation
      // In production, use Google Cloud Speech-to-Text API

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock transcription results based on audio type
      const mockTranscripts = [
        "I'm looking for a beautiful handmade ceramic vase in blue color with traditional Indian patterns",
        'Can you show me handwoven silk sarees with golden borders and intricate embroidery work',
        'I need a set of wooden handicrafts including bowls, spoons and decorative items for my kitchen',
        'Looking for silver jewelry pieces like earrings, necklace and bangles with traditional designs',
        'I want to buy handmade leather bags with ethnic patterns and good quality craftsmanship',
        'Show me bamboo furniture items like chairs, tables and storage baskets for my home',
      ];

      const randomTranscript =
        mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];

      return {
        transcript: randomTranscript,
        confidence: 0.85 + Math.random() * 0.1, // Random confidence between 0.85-0.95
        language: 'en-US',
        duration: Math.floor(Math.random() * 30) + 10, // 10-40 seconds
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Audio transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  /**
   * Generate product suggestions from text
   * @param {string} transcript - Text from voice input
   * @returns {Promise<Array>}
   */
  async generateProductSuggestions(transcript) {
    try {
      // Mock implementation
      // In production, use Google Cloud Vertex AI or similar

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const suggestions = this.parseTranscriptForProducts(transcript);

      return {
        suggestions,
        categories: this.extractCategories(transcript),
        keywords: this.extractKeywords(transcript),
        confidence: 0.8 + Math.random() * 0.15,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Product suggestion error:', error);
      throw new Error('Failed to generate product suggestions');
    }
  }

  /**
   * Parse transcript to extract product information
   * @param {string} transcript - Voice transcript
   * @returns {Array}
   */
  parseTranscriptForProducts(transcript) {
    const text = transcript.toLowerCase();
    const suggestions = [];

    // Ceramic products
    if (
      text.includes('ceramic') ||
      text.includes('pottery') ||
      text.includes('vase') ||
      text.includes('bowl')
    ) {
      suggestions.push({
        type: 'ceramic',
        category: 'Home Decor',
        title: 'Handmade Ceramic Vase',
        description:
          'Beautiful blue ceramic vase with traditional Indian patterns',
        price_range: { min: 500, max: 2000 },
        materials: ['ceramic', 'clay'],
        colors: text.includes('blue') ? ['blue'] : ['blue', 'white', 'brown'],
        tags: ['handmade', 'traditional', 'ceramic', 'home-decor'],
      });
    }

    // Textiles
    if (
      text.includes('saree') ||
      text.includes('silk') ||
      text.includes('embroidery') ||
      text.includes('fabric')
    ) {
      suggestions.push({
        type: 'textile',
        category: 'Clothing',
        title: 'Handwoven Silk Saree',
        description:
          'Elegant silk saree with golden borders and intricate embroidery',
        price_range: { min: 2000, max: 8000 },
        materials: ['silk', 'cotton'],
        colors: ['gold', 'red', 'blue', 'green'],
        tags: ['handwoven', 'silk', 'traditional', 'embroidery'],
      });
    }

    // Wooden crafts
    if (
      text.includes('wooden') ||
      text.includes('wood') ||
      text.includes('handicraft') ||
      text.includes('bowl')
    ) {
      suggestions.push({
        type: 'wood',
        category: 'Kitchen & Dining',
        title: 'Wooden Handicraft Set',
        description: 'Set of wooden bowls, spoons and decorative items',
        price_range: { min: 800, max: 3000 },
        materials: ['wood', 'bamboo'],
        colors: ['natural', 'brown'],
        tags: ['handmade', 'wooden', 'kitchen', 'eco-friendly'],
      });
    }

    // Jewelry
    if (
      text.includes('jewelry') ||
      text.includes('silver') ||
      text.includes('earrings') ||
      text.includes('necklace')
    ) {
      suggestions.push({
        type: 'jewelry',
        category: 'Accessories',
        title: 'Traditional Silver Jewelry',
        description: 'Silver jewelry set with earrings, necklace and bangles',
        price_range: { min: 1500, max: 5000 },
        materials: ['silver', 'gold-plated'],
        colors: ['silver', 'gold'],
        tags: ['handmade', 'silver', 'traditional', 'jewelry'],
      });
    }

    // Leather goods
    if (
      text.includes('leather') ||
      text.includes('bag') ||
      text.includes('purse')
    ) {
      suggestions.push({
        type: 'leather',
        category: 'Bags & Accessories',
        title: 'Handmade Leather Bag',
        description: 'Ethnic leather bag with traditional patterns',
        price_range: { min: 1200, max: 4000 },
        materials: ['leather', 'canvas'],
        colors: ['brown', 'black', 'tan'],
        tags: ['handmade', 'leather', 'ethnic', 'bag'],
      });
    }

    // Bamboo furniture
    if (
      text.includes('bamboo') ||
      text.includes('furniture') ||
      text.includes('chair') ||
      text.includes('table')
    ) {
      suggestions.push({
        type: 'furniture',
        category: 'Furniture',
        title: 'Bamboo Furniture Set',
        description: 'Eco-friendly bamboo chairs, tables and storage baskets',
        price_range: { min: 3000, max: 12000 },
        materials: ['bamboo', 'cane'],
        colors: ['natural', 'light brown'],
        tags: ['eco-friendly', 'bamboo', 'furniture', 'sustainable'],
      });
    }

    // If no specific products found, add general suggestions
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'general',
        category: 'Handicrafts',
        title: 'Artisan Handicrafts',
        description: 'Explore our collection of handmade products',
        price_range: { min: 200, max: 5000 },
        materials: ['various'],
        colors: ['multiple'],
        tags: ['handmade', 'artisan', 'craft', 'traditional'],
      });
    }

    return suggestions;
  }

  /**
   * Extract categories from transcript
   * @param {string} transcript - Voice transcript
   * @returns {Array}
   */
  extractCategories(transcript) {
    const text = transcript.toLowerCase();
    const categories = [];

    const categoryMap = {
      'Home Decor': ['ceramic', 'vase', 'decoration', 'home', 'decor'],
      Clothing: ['saree', 'dress', 'clothing', 'fabric', 'textile'],
      'Kitchen & Dining': ['bowl', 'spoon', 'kitchen', 'dining', 'utensil'],
      Accessories: ['jewelry', 'bag', 'purse', 'accessory'],
      Furniture: ['chair', 'table', 'furniture', 'storage', 'basket'],
    };

    for (const [category, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        categories.push(category);
      }
    }

    return categories.length > 0 ? categories : ['Handicrafts'];
  }

  /**
   * Extract keywords from transcript
   * @param {string} transcript - Voice transcript
   * @returns {Array}
   */
  extractKeywords(transcript) {
    const text = transcript.toLowerCase();
    const keywords = [];

    const keywordPatterns = [
      'handmade',
      'traditional',
      'ceramic',
      'wooden',
      'silk',
      'silver',
      'leather',
      'bamboo',
      'embroidery',
      'patterns',
      'ethnic',
      'crafts',
      'artisan',
      'handcrafted',
      'vintage',
      'antique',
      'decorative',
    ];

    keywordPatterns.forEach(keyword => {
      if (text.includes(keyword)) {
        keywords.push(keyword);
      }
    });

    // Extract colors
    const colors = [
      'blue',
      'red',
      'green',
      'yellow',
      'white',
      'black',
      'brown',
      'gold',
      'silver',
    ];
    colors.forEach(color => {
      if (text.includes(color)) {
        keywords.push(color);
      }
    });

    return keywords;
  }

  /**
   * Analyze sentiment of the transcript
   * @param {string} transcript - Voice transcript
   * @returns {Object}
   */
  analyzeSentiment(transcript) {
    // Simple sentiment analysis
    const positiveWords = [
      'beautiful',
      'good',
      'great',
      'excellent',
      'amazing',
      'wonderful',
      'love',
      'like',
    ];
    const negativeWords = [
      'bad',
      'poor',
      'terrible',
      'awful',
      'hate',
      'dislike',
    ];

    const text = transcript.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      if (text.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
      if (text.includes(word)) negativeCount++;
    });

    let sentiment = 'neutral';
    let score = 0;

    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      score = Math.min(1, (positiveCount - negativeCount) / 5);
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      score = Math.max(-1, (negativeCount - positiveCount) / -5);
    }

    return {
      sentiment,
      score,
      confidence: 0.7 + Math.random() * 0.2,
    };
  }
}

export default new AIService();
