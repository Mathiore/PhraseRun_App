
import WordOfTheDay from "@/components/WordOfTheDay";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen pb-16">
      <div className="w-full px-4 sm:container sm:mx-auto">
        <div className="pt-4 px-2 sm:px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-wordly-primary">PhraseRun</h1>
          <p className="text-center text-muted-foreground text-xs sm:text-sm mt-1 mb-4">Learn a new word or phrase every day</p>
        </div>
        <WordOfTheDay />
      </div>
      <Navbar />
    </div>
  );
};

export default Dashboard;
