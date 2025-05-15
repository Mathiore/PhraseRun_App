
import Settings from "@/components/Settings";
import Navbar from "@/components/Navbar";

const SettingsPage = () => {
  return (
    <div className="min-h-screen pb-16">
      <div className="container mx-auto">
        <Settings />
      </div>
      <Navbar />
    </div>
  );
};

export default SettingsPage;
