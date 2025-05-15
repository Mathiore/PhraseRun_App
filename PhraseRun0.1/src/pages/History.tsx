
import WordHistory from "@/components/WordHistory";
import Navbar from "@/components/Navbar";

const History = () => {
  return (
    <div className="min-h-screen pb-16">
      <div className="container mx-auto max-w-3xl pt-4">
        <WordHistory />
      </div>
      <Navbar />
    </div>
  );
};

export default History;
