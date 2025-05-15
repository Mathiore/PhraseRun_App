
import QuizMode from "@/components/QuizMode";
import Navbar from "@/components/Navbar";

const Quiz = () => {
  return (
    <div className="min-h-screen pb-16">
      <div className="container mx-auto">
        <QuizMode />
      </div>
      <Navbar />
    </div>
  );
};

export default Quiz;
