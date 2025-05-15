
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { generateQuiz } from "@/data/wordData";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  options: string[];
}

const QuizMode = () => {
  const { currentLanguage } = useLanguage();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    
    // Generate quiz questions based on current language
    const quizQuestions = generateQuiz(currentLanguage);
    
    setTimeout(() => {
      if (quizQuestions.length >= 3) {
        setQuestions(quizQuestions);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswerChecked(false);
        setScore(0);
        setIsQuizCompleted(false);
      } else {
        toast({
          title: "Not enough words",
          description: "You need at least 4 words in your history to generate a quiz. Learn more words first!",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 800);
  }, [currentLanguage, toast]);

  const handleSelectAnswer = (answer: string) => {
    if (isAnswerChecked) return; // Prevent changing answer after checking
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setIsAnswerChecked(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-16 w-16 rounded-full bg-wordly-primary/20 flex items-center justify-center animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wordly-primary">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
        <h2 className="text-xl mt-4 text-muted-foreground">Preparing your quiz...</h2>
      </div>
    );
  }

  if (questions.length < 3) {
    return (
      <div className="p-8 text-center animate-fade-in">
        <div className="bg-wordly-light dark:bg-wordly-dark rounded-xl p-8 text-center max-w-md mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-wordly-primary">
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <path d="m9 10 2 2 4-4"></path>
            <path d="M12 14h.01"></path>
            <path d="M9 18h.01"></path>
            <path d="M15 18h.01"></path>
          </svg>
          <h2 className="text-2xl font-bold mb-2">Not Enough Words</h2>
          <p className="text-muted-foreground mb-6">
            You need at least 4 words in your history to take a quiz. 
            Come back after learning a few more words!
          </p>
          <Button 
            variant="default"
            onClick={() => window.history.back()}
          >
            Back to Word of the Day
          </Button>
        </div>
      </div>
    );
  }

  if (isQuizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="p-8 text-center animate-fade-in">
        <Card className="p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          
          <div className="mb-6">
            <div className="text-6xl font-bold text-wordly-primary mb-2">
              {score}/{questions.length}
            </div>
            <p className="text-muted-foreground">
              You scored {percentage}%
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={handleRestartQuiz} 
              variant="default" 
              className="w-full"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => window.history.back()} 
              variant="outline" 
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">Daily Quiz</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="font-medium">
          Score: {score}
        </div>
      </div>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">
          What does <span className="text-wordly-primary">{currentQuestion.question}</span> mean?
        </h2>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option w-full text-left ${
                selectedAnswer === option 
                  ? isAnswerChecked 
                    ? option === currentQuestion.correctAnswer 
                      ? 'correct' 
                      : 'incorrect'
                    : 'selected'
                  : ''
              } ${
                isAnswerChecked && option === currentQuestion.correctAnswer ? 'correct' : ''
              }`}
              onClick={() => handleSelectAnswer(option)}
              disabled={isAnswerChecked}
            >
              <div className="flex items-center justify-between">
                <div>{option}</div>
                {isAnswerChecked && option === currentQuestion.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {isAnswerChecked && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-6 flex justify-center">
          {isAnswerChecked ? (
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          ) : (
            <Button 
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer}
            >
              Check Answer
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuizMode;
