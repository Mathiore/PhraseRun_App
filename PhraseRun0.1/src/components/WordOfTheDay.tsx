
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { getTodayWord, Word, toggleFavorite } from "@/data/wordData";
import { Star, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const WordOfTheDay = () => {
  const { currentLanguage } = useLanguage();
  const [todayWord, setTodayWord] = useState<Word | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Store the current word ID in localStorage to persist across navigation
  const storageKey = `currentWord_${currentLanguage}`;

  useEffect(() => {
    setIsLoading(true);
    // Check if we have a stored word ID for the current language
    const storedWordId = localStorage.getItem(storageKey);
    
    // Get word based on stored ID or get today's word
    const word = storedWordId 
      ? getTodayWord(currentLanguage, false, storedWordId)
      : getTodayWord(currentLanguage);
    
    // Store the current word ID
    if (word) {
      localStorage.setItem(storageKey, word.id);
    }
    
    // Simulate a loading state
    setTimeout(() => {
      setTodayWord(word);
      setIsLoading(false);
    }, 800);
  }, [currentLanguage, storageKey]);

  const handleToggleFavorite = () => {
    if (todayWord) {
      try {
        const updatedWord = toggleFavorite(todayWord.id);
        setTodayWord({...updatedWord});
        
        toast({
          title: updatedWord.isFavorite ? "Added to favorites" : "Removed from favorites",
          description: `"${updatedWord.word}" has been ${updatedWord.isFavorite ? 'added to' : 'removed from'} your favorites.`,
        });
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    }
  };

  const handleLearnNewWord = () => {
    setIsLoading(true);
    // Get a new word for the current language
    const word = getTodayWord(currentLanguage, true); // Pass true to force new word
    
    // Store the new word ID
    if (word) {
      localStorage.setItem(storageKey, word.id);
    }
    
    toast({
      title: "New word loaded",
      description: "Here's a new word for you to learn!",
    });
    
    // Simulate a loading state
    setTimeout(() => {
      setTodayWord(word);
      setIsLoading(false);
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-16 w-16 rounded-full bg-wordly-primary/20 flex items-center justify-center animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wordly-primary">
            <path d="M12 20.04V4"></path>
            <path d="m4.93 10.93 7.07-7.07"></path>
            <path d="m19.07 10.93-7.07-7.07"></path>
          </svg>
        </div>
        <h2 className="text-xl mt-4 text-muted-foreground">Loading your word of the day...</h2>
      </div>
    );
  }

  if (!todayWord) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-muted-foreground">
          Could not load today's word. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">Daily Phrase & Word</h1>
      
      <Card className="word-card">
        <span className="language-badge">{todayWord.language}</span>
        
        <div className="flex justify-between items-center">
          <h2 className="word-text">{todayWord.word}</h2>
          <button 
            onClick={handleToggleFavorite} 
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
            aria-label={todayWord.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              className={`h-6 w-6 ${todayWord.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
            />
          </button>
        </div>
        
        <p className="pronunciation">{todayWord.pronunciation}</p>
        
        <div className="definition">{todayWord.definition}</div>
        
        <div className="example">{todayWord.example}</div>
        
        {todayWord.translation && (
          <div className="mt-4 text-sm text-muted-foreground">
            <span className="font-medium">Translation:</span> {todayWord.translation}
          </div>
        )}
        
        {todayWord.conversationExample && (
          <div className="mt-4 p-3 bg-muted/30 rounded-md">
            <div className="font-medium mb-1 text-sm">Conversation Example:</div>
            <div className="ml-3">{todayWord.conversationExample.phrase}</div>
            {todayWord.language !== "english" && todayWord.conversationExample.phraseTranslation && (
              <div className="ml-3 text-sm text-muted-foreground italic">"{todayWord.conversationExample.phraseTranslation}"</div>
            )}
            <div className="mt-1 ml-6 text-muted-foreground">↳ {todayWord.conversationExample.response}</div>
            {todayWord.language !== "english" && todayWord.conversationExample.responseTranslation && (
              <div className="ml-6 text-sm text-muted-foreground italic">"{todayWord.conversationExample.responseTranslation}"</div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <Button 
            variant="outline" 
            className="rounded-full border-wordly-primary text-wordly-primary hover:bg-wordly-primary/10"
            onClick={() => {
              toast({
                title: "Pronunciation",
                description: "Audio pronunciation will be available in a future update.",
              });
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
            Listen
          </Button>
          
          <Button 
            onClick={handleLearnNewWord}
            className="rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Learn New Word
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default WordOfTheDay;
