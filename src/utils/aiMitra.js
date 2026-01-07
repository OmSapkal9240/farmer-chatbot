import data from '../data/maharashtra_agriculture_master_multilang.json';

// A simple language detector (can be improved with a library if needed)
const detectLanguage = (text) => {
  const marathiChars = /[\u0900-\u097F]/;
  const hindiChars = /[\u0900-\u097F]/; // Hindi and Marathi share the Devanagari script

  if (marathiChars.test(text)) {
    // This is a simplification. A real implementation would need more sophisticated logic
    // to differentiate Hindi and Marathi. For now, we can check for specific Marathi words.
    if (text.includes('मध्ये') || text.includes('आहे') || text.includes('पिक')) {
        return 'marathi';
    }
    return 'hindi'; // Default to Hindi if script is Devanagari but not clearly Marathi
  }
  return 'english'; // Default to English
};

// Find relevant knowledge chunk
const findKnowledgeChunk = (district, crop) => {
  return data.knowledge_chunks.find(chunk => 
    chunk.metadata.district?.toLowerCase() === district?.toLowerCase() && 
    chunk.metadata.crop?.toLowerCase() === crop?.toLowerCase()
  );
};

// Fallback search by agro-climatic zone
const findZoneKnowledge = (district, crop) => {
    const zone = Object.keys(data.agro_zones).find(zoneName => 
        data.agro_zones[zoneName].districts.includes(district)
    );
    if (!zone) return null;

    return data.knowledge_chunks.find(chunk => 
        chunk.metadata.zone === zone && chunk.metadata.crop?.toLowerCase() === crop?.toLowerCase()
    );
}

export const getAiMitraResponse = (message) => {
  const language = detectLanguage(message);
  const lowerCaseMessage = message.toLowerCase().trim();

  // Handle simple greetings
  const greetings = ['hello', 'hi', 'namaste', 'namaskar'];
  if (greetings.includes(lowerCaseMessage)) {
    const responses = {
      english: 'Hello! How can I help you with farming today?',
      hindi: 'Namaskar! Main kheti-baadi mein aapki kaise madad kar sakti hoon?',
      marathi: 'Namaskar! Mi sheti vishayak tumchi kai madat karu shakto?'
    };
    return responses[language];
  }

  // New entity extraction logic using query_tags
  let matchedChunk = null;
  for (const chunk of data.knowledge_chunks) {
    if (chunk.metadata.query_tags) {
      for (const tag of chunk.metadata.query_tags) {
        if (lowerCaseMessage.includes(tag.toLowerCase())) {
          matchedChunk = chunk;
          break;
        }
      }
    }
    if (matchedChunk) break;
  }

  if (matchedChunk) {
    const district = matchedChunk.metadata.district;
    const crop = matchedChunk.metadata.crop;
    const chunk = matchedChunk; // Use the matched chunk directly
    const langData = chunk.languages[language];
    const solutions = chunk.solutions[language];
    const zoneName = Object.keys(data.agro_zones).find(zone => data.agro_zones[zone].districts.includes(district));


    // Format the response
    let response = ``;
    if(language === 'hindi'){
        response += `आपके जिले के अनुसार जानकारी नीचे दी गई है।\n\n`;
        response += `**फसल:** ${crop}\n`;
        response += `**जिला:** ${district}\n`;
        if(zoneName) response += `**कृषि-जलवायु क्षेत्र:** ${zoneName}\n\n`;
        response += `**समस्या:**\n${langData.content}\n\n`;
        response += `**समाधान:**\n${solutions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    } else if (language === 'marathi'){
        response += `तुमच्या जिल्ह्यानुसार माहिती खालीलप्रमाणे आहे.\n\n`;
        response += `**पीक:** ${crop}\n`;
        response += `**जिल्हा:** ${district}\n`;
        if(zoneName) response += `**कृषी-हवामान क्षेत्र:** ${zoneName}\n\n`;
        response += `**समस्या:**\n${langData.content}\n\n`;
        response += `**उपाय:**\n${solutions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    } else {
        response += `Here is the information for your district:\n\n`;
        response += `**Crop:** ${crop}\n`;
        response += `**District:** ${district}\n`;
        if(zoneName) response += `**Agro-climatic Zone:** ${zoneName}\n\n`;
        response += `**Problem:**\n${langData.content}\n\n`;
        response += `**Solution:**\n${solutions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    }

    return response;
  } else {
    // Return null to indicate that no local answer was found
    return null;
  }
};
