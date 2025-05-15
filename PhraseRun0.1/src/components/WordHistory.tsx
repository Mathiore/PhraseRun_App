
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getWordHistory, toggleFavorite, Word } from "@/data/wordData";
import { useLanguage } from "@/context/LanguageContext";
import { Search, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const WordHistory = () => {
  const { currentLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Get all words from history
    const history = getWordHistory();
    // Filter by current language
    const languageWords = history.filter(word => word.language === currentLanguage);
    // Sort by date, most recent first
    const sortedWords = languageWords.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    setWords(sortedWords);
    
    // Apply any existing filters
    filterWords(sortedWords, searchTerm, showFavoritesOnly);
  }, [currentLanguage, searchTerm, showFavoritesOnly, refreshKey]); 

  // Refresh data when returning to this screen
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setRefreshKey(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', () => setRefreshKey(prev => prev + 1));
    
    // Initial load
    setRefreshKey(prev => prev + 1);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', () => {
        setRefreshKey(prev => prev + 1);
      });
    };
  }, []);

  const filterWords = (wordList: Word[], term: string, favoritesOnly: boolean) => {
    let result = wordList;
    
    // Filter by search term
    if (term) {
      result = result.filter(word => 
        word.word.toLowerCase().includes(term.toLowerCase()) || 
        word.definition.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    // Filter by favorites
    if (favoritesOnly) {
      result = result.filter(word => word.isFavorite);
    }
    
    setFilteredWords(result);
  };

  const handleToggleFavorite = (wordId: string) => {
    try {
      // First update in localStorage via the data function
      toggleFavorite(wordId);
      
      // Get fresh data from localStorage to ensure we have the latest state
      const updatedHistory = getWordHistory();
      const updatedWord = updatedHistory.find(w => w.id === wordId);
      
      if (!updatedWord) {
        throw new Error("Word not found after toggling favorite");
      }
      
      // Update the words in our state with fresh data
      setWords(prev => prev.map(word => {
        if (word.id === wordId) {
          return updatedWord;
        }
        return word;
      }));
      
      // Update filtered words too
      setFilteredWords(prev => {
        const newFilteredWords = prev.map(word => {
          if (word.id === wordId) {
            // If showing favorites only and we're unfavoriting, we'll filter this out later
            return updatedWord;
          }
          return word;
        });
        
        // If showing favorites only, remove unfavorited words
        if (showFavoritesOnly) {
          return newFilteredWords.filter(word => word.isFavorite);
        }
        
        return newFilteredWords;
      });

      // Show toast notification
      toast({
        title: updatedWord.isFavorite ? "Added to favorites" : "Removed from favorites",
        description: `Word has been ${updatedWord.isFavorite ? 'added to' : 'removed from'} your favorites.`,
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update favorite status.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">Word History</h1>
      
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search words or definitions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            variant={showFavoritesOnly ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="text-xs flex items-center gap-1"
          >
            <Star className={`h-4 w-4 ${showFavoritesOnly ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            {showFavoritesOnly ? "All Words" : "Favorites Only"}
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow border border-border overflow-hidden">
        {filteredWords.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {words.length === 0 
              ? "No words in your history yet. Come back tomorrow for more words!" 
              : showFavoritesOnly 
                ? "No favorite words yet. Click the star icon to add favorites."
                : "No words match your search."}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredWords.map((word) => (
              <div key={word.id} className="word-history-item p-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{word.word}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(word.date)}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{word.definition}</p>
                  {word.conversationExample && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p className="italic">"{word.conversationExample.phrase}"</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleToggleFavorite(word.id)}
                  className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                  aria-label={word.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star
                    className={`h-5 w-5 ${word.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordHistory;
