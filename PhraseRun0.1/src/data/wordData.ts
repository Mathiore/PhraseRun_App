import { Language } from "@/context/LanguageContext";

export interface ConversationExample {
  phrase: string;
  response: string;
  phraseTranslation?: string;
  responseTranslation?: string;
}

export interface Word {
  id: string;
  word: string;
  language: Language;
  pronunciation: string;
  definition: string;
  example: string;
  translation?: string;
  conversationExample?: ConversationExample;
  date: string;
  isFavorite?: boolean;
}

// Get shown words for a specific language
const getShownWords = (language: Language): string[] => {
  const shownWordsKey = `shownWords_${language}`;
  const shownWords = localStorage.getItem(shownWordsKey);
  return shownWords ? JSON.parse(shownWords) : [];
};

// Mark a word as shown
const markWordAsShown = (language: Language, word: string): void => {
  const shownWordsKey = `shownWords_${language}`;
  const shownWords = getShownWords(language);
  
  if (!shownWords.includes(word)) {
    shownWords.push(word);
    localStorage.setItem(shownWordsKey, JSON.stringify(shownWords));
  }
};

// Reset shown words for a language
const resetShownWords = (language: Language): void => {
  const shownWordsKey = `shownWords_${language}`;
  localStorage.removeItem(shownWordsKey);
};

// Get today's word based on language
export const getTodayWord = (
  language: Language, 
  forceNew: boolean = false,
  specificWordId?: string
): Word => {
  const today = new Date().toISOString().split('T')[0];
  
  // If a specific word ID is provided, try to find it in the history
  if (specificWordId) {
    const history = getWordHistory();
    const specificWord = history.find(word => word.id === specificWordId);
    if (specificWord) {
      return specificWord;
    }
  }
  
  // Find if we already have a word for today in the history
  const history = getWordHistory();
  const existingTodayWord = history.find(word => word.date === today && word.language === language);
  
  if (existingTodayWord && !forceNew) {
    return existingTodayWord;
  }
  
  // Otherwise, get a new word based on language that hasn't been shown yet
  let availableWords: any[] = [];
  let allWords: any[] = [];
  
  // Get all words for the selected language
  switch (language) {
    case 'japanese':
      allWords = japaneseWords;
      break;
    case 'portuguese':
      allWords = portugueseWords;
      break;
    case 'french':
      allWords = frenchWords;
      break;
    case 'german':
      allWords = germanWords;
      break;
    case 'italian':
      allWords = italianWords;
      break;
    case 'english':
    default:
      allWords = englishWords;
  }
  
  // Get the list of words that have already been shown
  const shownWords = getShownWords(language);
  
  // Filter out words that have already been shown
  availableWords = allWords.filter(word => !shownWords.includes(word.word));
  
  // If all words have been shown, reset the list and use all words
  if (availableWords.length === 0) {
    resetShownWords(language);
    availableWords = allWords;
  }
  
  // Select a random word from the available words
  const randomIndex = Math.floor(Math.random() * availableWords.length);
  const newWord = availableWords[randomIndex];
  
  // Mark this word as shown
  markWordAsShown(language, newWord.word);
  
  // Create a new word with today's date and save it to history
  const todayWord: Word = {
    ...newWord,
    id: `${language}-${Date.now()}`,
    date: today,
    isFavorite: false
  };
  
  saveWordToHistory(todayWord);
  return todayWord;
};

// Save a word to history in localStorage
export const saveWordToHistory = (word: Word): void => {
  const history = getWordHistory();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if we already have a word for today in the same language
  const existingIndex = history.findIndex(w => w.date === today && w.language === word.language);
  
  if (existingIndex >= 0) {
    // Replace the existing word for today
    history[existingIndex] = word;
  } else {
    // Add the new word
    history.push(word);
  }
  
  localStorage.setItem('wordHistory', JSON.stringify(history));
};

// Get word history from localStorage
export const getWordHistory = (): Word[] => {
  const history = localStorage.getItem('wordHistory');
  return history ? JSON.parse(history) : [];
};

// Update a word in the history (e.g., mark as favorite)
export const updateWord = (updatedWord: Word): void => {
  const history = getWordHistory();
  const index = history.findIndex(word => word.id === updatedWord.id);
  
  if (index >= 0) {
    history[index] = updatedWord;
    localStorage.setItem('wordHistory', JSON.stringify(history));
  }
};

// Toggle favorite status for a word
export const toggleFavorite = (wordId: string): Word => {
  const history = getWordHistory();
  const index = history.findIndex(word => word.id === wordId);
  
  if (index >= 0) {
    history[index].isFavorite = !history[index].isFavorite;
    localStorage.setItem('wordHistory', JSON.stringify(history));
    return history[index];
  }
  
  throw new Error('Word not found');
};

// Generate quiz questions based on a set of words
export const generateQuiz = (language: Language): { 
  question: string;
  correctAnswer: string;
  options: string[];
}[] => {
  const history = getWordHistory().filter(word => word.language === language);
  
  if (history.length < 4) {
    return [];
  }
  
  // Shuffle the history array
  const shuffledHistory = [...history].sort(() => Math.random() - 0.5);
  
  // Take the first 5 words or as many as we have
  const quizWords = shuffledHistory.slice(0, 5);
  
  return quizWords.map(word => {
    // Get 3 other random words for wrong answers
    const otherWords = shuffledHistory
      .filter(w => w.id !== word.id)
      .slice(0, 3);
    
    const options = [
      word.definition,
      ...otherWords.map(w => w.definition)
    ].sort(() => Math.random() - 0.5);
    
    return {
      question: word.word,
      correctAnswer: word.definition,
      options
    };
  });
};

// Sample English words
const englishWords = [
  {
    word: "Serendipity",
    language: "english" as Language,
    pronunciation: "seh-ruhn-DIP-ih-tee",
    definition: "The occurrence of favorable events by chance",
    example: "Finding that rare book at a garage sale was a wonderful serendipity.",
    conversationExample: {
      phrase: "I had the most amazing serendipity today! I was just thinking about an old friend when they called me.",
      response: "That's such a coincidence! It's always nice when that happens."
    }
  },
  {
    word: "Ephemeral",
    language: "english" as Language,
    pronunciation: "ih-FEM-er-uhl",
    definition: "Lasting for a very short time",
    example: "The ephemeral beauty of cherry blossoms makes them special.",
    conversationExample: {
      phrase: "The pleasure of eating ice cream on a hot day is sadly ephemeral.",
      response: "Yes, those brief moments of joy are worth savoring!"
    }
  },
  {
    word: "Ubiquitous",
    language: "english" as Language,
    pronunciation: "yoo-BIK-wih-tuhs",
    definition: "Present, appearing, or found everywhere",
    example: "Smartphones have become ubiquitous in modern society.",
    conversationExample: {
      phrase: "Coffee shops are ubiquitous in this city, there's one on every corner!",
      response: "I know! I can never decide which one to go to."
    }
  },
  {
    word: "Hello",
    language: "english" as Language,
    pronunciation: "heh-LOH",
    definition: "Used as a greeting or to begin a phone conversation",
    example: "Hello, welcome to our store!",
    conversationExample: {
      phrase: "Hello, how are you doing today?",
      response: "Hi! I'm good, thanks for asking. How about you?"
    }
  },
  {
    word: "Excuse me",
    language: "english" as Language,
    pronunciation: "ik-SKYOOZ mee",
    definition: "Used to politely get someone's attention or apologize for an interruption",
    example: "Excuse me, could you tell me the time?",
    conversationExample: {
      phrase: "Excuse me, is this seat taken?",
      response: "No, please feel free to sit here."
    }
  },
  {
    word: "Eloquent",
    language: "english" as Language,
    pronunciation: "EL-uh-kwuhnt",
    definition: "Fluent or persuasive in speaking or writing",
    example: "Her eloquent speech moved the entire audience to tears.",
    conversationExample: {
      phrase: "I love how she can express herself so clearly.",
      response: "That's really impressive!"
    }
  },
  {
    word: "Resilience",
    language: "english" as Language,
    pronunciation: "ri-ZIL-yuhnts",
    definition: "The capacity to recover quickly from difficulties",
    example: "The community showed remarkable resilience after the natural disaster.",
    conversationExample: {
      phrase: "I'm so proud of how they bounced back from that disaster.",
      response: "That's a great example of resilience!"
    }
  },
  {
    word: "Paradox",
    language: "english" as Language,
    pronunciation: "PAIR-uh-doks",
    definition: "A statement that contradicts itself but might be true",
    example: "The paradox of the situation was that by losing the job, he found his true calling.",
    conversationExample: {
      phrase: "I never thought I'd find my passion in this field.",
      response: "That's a great example of a paradox!"
    }
  },
  {
    word: "Meticulous",
    language: "english" as Language,
    pronunciation: "muh-TIK-yuh-luhs",
    definition: "Showing great attention to detail",
    example: "The watchmaker was meticulous in assembling the tiny components.",
    conversationExample: {
      phrase: "I always appreciate when someone takes their time to do something well.",
      response: "That's a really nice quality!"
    }
  }
];

// Sample Japanese words
const japaneseWords = [
  {
    word: "間 (Ma)",
    language: "japanese" as Language,
    pronunciation: "mah",
    definition: "Space, pause or the interval between things",
    example: "In Japanese design, the concept of 間 (ma) is important for creating balance.",
    translation: "Space/Interval",
    conversationExample: {
      phrase: "この部屋の間の取り方が素晴らしいですね。",
      phraseTranslation: "The use of space in this room is wonderful.",
      response: "ありがとうございます。バランスが大切だと思います。",
      responseTranslation: "Thank you. I think balance is important."
    }
  },
  {
    word: "侘寂 (Wabi-sabi)",
    language: "japanese" as Language,
    pronunciation: "wah-bee sah-bee",
    definition: "Finding beauty in imperfection",
    example: "The cracked pottery embodies the wabi-sabi aesthetic.",
    translation: "Imperfect beauty",
    conversationExample: {
      phrase: "この古い茶碗は侘寂の美しさがありますね。",
      phraseTranslation: "This old tea bowl has wabi-sabi beauty, doesn't it?",
      response: "はい、その傷や不完全さがむしろ魅力的です。",
      responseTranslation: "Yes, those scratches and imperfections are rather charming."
    }
  },
  {
    word: "木漏れ日 (Komorebi)",
    language: "japanese" as Language,
    pronunciation: "ko-mo-reh-bee",
    definition: "Sunlight filtering through trees",
    example: "The komorebi created beautiful patterns on the forest floor.",
    translation: "Sunshine filtering through leaves",
    conversationExample: {
      phrase: "公園の木漏れ日が美しいですね。",
      phraseTranslation: "The sunlight filtering through the trees in the park is beautiful, isn't it?",
      response: "はい、とても癒されます。",
      responseTranslation: "Yes, it's very soothing."
    }
  },
  {
    word: "一期一会 (Ichigo Ichie)",
    language: "japanese" as Language,
    pronunciation: "ee-chee-go ee-chee-eh",
    definition: "Treasuring the unrepeatable nature of a moment",
    example: "Remember the concept of ichigo ichie when meeting someone new.",
    translation: "Once in a lifetime meeting",
    conversationExample: {
      phrase: "この一期一会の機会を大切にしましょう。",
      phraseTranslation: "Let's cherish this once-in-a-lifetime opportunity.",
      response: "はい、この瞬間は二度と来ませんね。",
      responseTranslation: "Yes, this moment will never come again."
    }
  },
  {
    word: "懐かしい (Natsukashii)",
    language: "japanese" as Language,
    pronunciation: "nah-tsu-kah-shee",
    definition: "Evocative longing for the past",
    example: "Hearing that old song gave me a natsukashii feeling.",
    translation: "Nostalgic",
    conversationExample: {
      phrase: "この歌を聴くと懐かしい気持ちになります。",
      phraseTranslation: "Listening to this song gives me a nostalgic feeling.",
      response: "私も同じです。学生時代を思い出します。",
      responseTranslation: "Me too. It reminds me of my student days."
    }
  }
];

// Sample Portuguese words
const portugueseWords = [
  {
    word: "Saudade",
    language: "portuguese" as Language,
    pronunciation: "saw-DAH-jee",
    definition: "A deep longing for something or someone that is absent",
    example: "Sinto saudade do tempo que passamos juntos no Brasil.",
    translation: "Longing/Nostalgia",
    conversationExample: {
      phrase: "Tenho muita saudade da minha cidade natal.",
      phraseTranslation: "I really miss my hometown.",
      response: "Eu entendo. Quando foi a última vez que você visitou?",
      responseTranslation: "I understand. When was the last time you visited?"
    }
  },
  {
    word: "Desenrascanço",
    language: "portuguese" as Language,
    pronunciation: "deh-zen-hass-KAN-so",
    definition: "The ability to solve a problem without proper tools or knowledge",
    example: "Precisamos de desenrascanço para consertar o carro sem as ferramentas adequadas.",
    translation: "Resourcefulness",
    conversationExample: {
      phrase: "O desenrascanço português é conhecido mundialmente.",
      phraseTranslation: "Portuguese resourcefulness is known worldwide.",
      response: "É verdade, sempre encontramos uma solução criativa.",
      responseTranslation: "It's true, we always find a creative solution."
    }
  },
  {
    word: "Cafuné",
    language: "portuguese" as Language,
    pronunciation: "kah-foo-NEH",
    definition: "The act of tenderly running your fingers through someone's hair",
    example: "Ela adormeceu enquanto eu fazia cafuné nela.",
    translation: "Caressing hair",
    conversationExample: {
      phrase: "Adoro quando você faz cafuné em mim.",
      phraseTranslation: "I love it when you run your fingers through my hair.",
      response: "Eu sei, sempre te ajuda a relaxar.",
      responseTranslation: "I know, it always helps you relax."
    }
  },
  {
    word: "Apaixonar",
    language: "portuguese" as Language,
    pronunciation: "ah-pie-shon-AR",
    definition: "To fall in love",
    example: "É impossível não se apaixonar por esta cidade.",
    translation: "To fall in love",
    conversationExample: {
      phrase: "Me apaixonei por Lisboa logo na primeira visita.",
      phraseTranslation: "I fell in love with Lisbon on my first visit.",
      response: "É fácil se apaixonar por aquela cidade, não é?",
      responseTranslation: "It's easy to fall in love with that city, isn't it?"
    }
  },
  {
    word: "Madrugada",
    language: "portuguese" as Language,
    pronunciation: "mah-droo-GAH-dah",
    definition: "The time between midnight and dawn",
    example: "Ele trabalhou até a madrugada para terminar o projeto.",
    translation: "Dawn/Early morning",
    conversationExample: {
      phrase: "Gosto de estudar na madrugada quando tudo está calmo.",
      phraseTranslation: "I like to study in the early morning when everything is quiet.",
      response: "A madrugada é mesmo um ótimo momento para concentração.",
      responseTranslation: "The early morning is indeed a great time for concentration."
    }
  }
];

// Sample French words
const frenchWords = [
  {
    word: "Flâner",
    language: "french" as Language,
    pronunciation: "flah-nay",
    definition: "To wander aimlessly with appreciation for the surroundings",
    example: "J'aime flâner dans les rues de Paris le dimanche.",
    translation: "To wander/stroll",
    conversationExample: {
      phrase: "On pourrait flâner dans le quartier cet après-midi?",
      phraseTranslation: "Could we stroll around the neighborhood this afternoon?",
      response: "Oui, c'est une excellente idée!",
      responseTranslation: "Yes, that's an excellent idea!"
    }
  },
  {
    word: "Dépaysement",
    language: "french" as Language,
    pronunciation: "day-pay-ez-MON",
    definition: "The feeling of being in a foreign land",
    example: "Le dépaysement que j'ai ressenti en arrivant à Tokyo était total.",
    translation: "Change of scenery/disorientation",
    conversationExample: {
      phrase: "J'ai vraiment ressenti un dépaysement total pendant mon voyage au Japon.",
      phraseTranslation: "I really felt a total change of scenery during my trip to Japan.",
      response: "Le dépaysement est ce qui rend les voyages si enrichissants.",
      responseTranslation: "The change of scenery is what makes traveling so enriching."
    }
  },
  {
    word: "Retrouvailles",
    language: "french" as Language,
    pronunciation: "reh-troo-VIE",
    definition: "The happiness of reuniting after a long separation",
    example: "Les retrouvailles avec ma famille après un an à l'étranger étaient émouvantes.",
    translation: "Reunion",
    conversationExample: {
      phrase: "Nos retrouvailles après tant d'années étaient vraiment émouvantes.",
      phraseTranslation: "Our reunion after so many years was really moving.",
      response: "Oui, j'ai eu les larmes aux yeux pendant nos retrouvailles.",
      responseTranslation: "Yes, I had tears in my eyes during our reunion."
    }
  },
  {
    word: "Gourmand",
    language: "french" as Language,
    pronunciation: "goor-MON",
    definition: "Someone who enjoys eating, especially in large quantities",
    example: "Il est très gourmand et ne peut jamais résister au dessert.",
    translation: "Food lover",
    conversationExample: {
      phrase: "Tu es vraiment gourmand, tu as déjà fini tout le gâteau!",
      phraseTranslation: "You're really a gourmand, you've already finished the whole cake!",
      response: "Que veux-tu, je suis gourmand et fier de l'être!",
      responseTranslation: "What can I say, I'm a gourmand and proud of it!"
    }
  },
  {
    word: "S'entraider",
    language: "french" as Language,
    pronunciation: "son-treh-day",
    definition: "To help one another mutually",
    example: "Dans ce village, les habitants s'entraident beaucoup.",
    translation: "To help each other",
    conversationExample: {
      phrase: "Dans notre quartier, les voisins s'entraident régulièrement.",
      phraseTranslation: "In our neighborhood, neighbors regularly help each other.",
      response: "C'est important de s'entraider, surtout en temps difficiles.",
      responseTranslation: "It's important to help each other, especially in difficult times."
    }
  }
];

// Sample German words
const germanWords = [
  {
    word: "Fernweh",
    language: "german" as Language,
    pronunciation: "FERN-vey",
    definition: "A longing for far-off places",
    example: "Seit ich diese Reisedokumentation gesehen habe, spüre ich Fernweh.",
    translation: "Distance-pain/wanderlust",
    conversationExample: {
      phrase: "Ich habe solches Fernweh im Moment.",
      phraseTranslation: "I'm really feeling the wanderlust right now.",
      response: "Wohin würdest du am liebsten reisen?",
      responseTranslation: "Where would you most like to travel?"
    }
  },
  {
    word: "Gemütlichkeit",
    language: "german" as Language,
    pronunciation: "guh-MOOT-likh-kite",
    definition: "A state of warmth, friendliness, and good cheer",
    example: "Die Gemütlichkeit des kleinen Cafés machte es zu unserem Lieblingsort.",
    translation: "Coziness/comfort",
    conversationExample: {
      phrase: "Dieses Café hat eine wunderbare Gemütlichkeit.",
      phraseTranslation: "This café has a wonderful coziness.",
      response: "Ja, die Gemütlichkeit hier ist einzigartig.",
      responseTranslation: "Yes, the coziness here is unique."
    }
  },
  {
    word: "Waldeinsamkeit",
    language: "german" as Language,
    pronunciation: "VALD-ine-zahm-kite",
    definition: "The feeling of being alone in the woods",
    example: "Die Waldeinsamkeit gab mir Zeit zum Nachdenken.",
    translation: "Forest-solitude",
    conversationExample: {
      phrase: "Ich genieße die Waldeinsamkeit auf meinen Wanderungen.",
      phraseTranslation: "I enjoy the forest solitude on my hikes.",
      response: "Die Waldeinsamkeit kann sehr beruhigend sein.",
      responseTranslation: "The forest solitude can be very calming."
    }
  },
  {
    word: "Zeitgeist",
    language: "german" as Language,
    pronunciation: "TSITE-geist",
    definition: "The defining spirit or mood of a particular period",
    example: "Seine Kunst spiegelt den Zeitgeist der 1960er Jahre wider.",
    translation: "Spirit of the times",
    conversationExample: {
      phrase: "Seine Musik erfasst perfekt den Zeitgeist unserer Generation.",
      phraseTranslation: "His music perfectly captures the zeitgeist of our generation.",
      response: "Du hast Recht, es ist ein echter Spiegel des Zeitgeists.",
      responseTranslation: "You're right, it's a true mirror of the spirit of our times."
    }
  },
  {
    word: "Schadenfreude",
    language: "german" as Language,
    pronunciation: "SHAH-den-froy-duh",
    definition: "Pleasure derived from another's misfortune",
    example: "Er empfand Schadenfreude, als sein Rivale das Spiel verlor.",
    translation: "Harm-joy",
    conversationExample: {
      phrase: "Ich versuche, keine Schadenfreude zu empfinden, wenn meine Konkurrenten scheitern.",
      phraseTranslation: "I try not to feel schadenfreude when my competitors fail.",
      response: "Das zeigt deinen guten Charakter, Schadenfreude ist keine schöne Eigenschaft.",
      responseTranslation: "That shows your good character, schadenfreude is not a nice trait."
    }
  }
];

// Sample Italian words
const italianWords = [
  {
    word: "Sprezzatura",
    language: "italian" as Language,
    pronunciation: "spret-sa-TOO-ra",
    definition: "The art of performing a difficult task so gracefully it looks effortless",
    example: "La sprezzatura del pianista era evidente nella sua esibizione.",
    translation: "Studied carelessness",
    conversationExample: {
      phrase: "Ammiro la sua sprezzatura nel parlare in pubblico.",
      phraseTranslation: "I admire his effortless grace when speaking in public.",
      response: "Sì, fa sembrare tutto così facile!",
      responseTranslation: "Yes, he makes everything look so easy!"
    }
  },
  {
    word: "Meriggiare",
    language: "italian" as Language,
    pronunciation: "meh-rid-JAH-reh",
    definition: "To rest at noon in the shade during hot weather",
    example: "Durante l'estate, è comune meriggiare sotto gli ulivi.",
    translation: "To shelter from the noon sun",
    conversationExample: {
      phrase: "In questa calura, preferisco meriggiare sotto questo grande albero.",
      phraseTranslation: "In this heat, I prefer to rest in the shade under this big tree.",
      response: "Hai ragione, meriggiare è la cosa migliore da fare con questo caldo.",
      responseTranslation: "You're right, resting in the shade is the best thing to do in this heat."
    }
  },
  {
    word: "Magari",
    language: "italian" as Language,
    pronunciation: "mah-GAH-ree",
    definition: "Perhaps, maybe, if only, I wish",
    example: "Magari potessi parlare italiano fluentemente!",
    translation: "Maybe/I wish",
    conversationExample: {
      phrase: "Magari un giorno potrò visitare la Toscana.",
      phraseTranslation: "I wish one day I could visit Tuscany.",
      response: "Magari ci andremo insieme l'anno prossimo!",
      responseTranslation: "Maybe we'll go there together next year!"
    }
  },
  {
    word: "Qualunquismo",
    language: "italian" as Language,
    pronunciation: "kwah-loon-KWEES-mo",
    definition: "Political apathy or indifference",
    example: "Il qualunquismo dei giovani è un problema per la democrazia.",
    translation: "Political apathy",
    conversationExample: {
      phrase: "Il qualunquismo è sempre più diffuso tra i giovani di oggi.",
      phraseTranslation: "Political apathy is increasingly common among today's youth.",
      response: "È vero, il qualunquismo è pericoloso per la democrazia.",
      responseTranslation: "It's true, political apathy is dangerous for democracy."
    }
  },
  {
    word: "Abbiocco",
    language: "italian" as Language,
    pronunciation: "ah-BYOK-ko",
    definition: "Drowsiness after a big meal",
    example: "Dopo il pranzo domenicale, tutti sentivano l'abbiocco.",
    translation: "Food coma",
    conversationExample: {
      phrase: "Dopo tutto quel cibo, ho un forte abbiocco.",
      phraseTranslation: "After all that food, I have a strong drowsiness.",
      response: "È normale avere l'abbiocco dopo un pasto così abbondante.",
      responseTranslation: "It's normal to feel drowsy after such a big meal."
    }
  }
];
