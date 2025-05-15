
import { Home, BookOpen, Award, Settings as SettingsIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    {
      label: "Today",
      icon: <Home className="h-5 w-5" />,
      path: "/dashboard",
    },
    {
      label: "History",
      icon: <BookOpen className="h-5 w-5" />,
      path: "/history",
    },
    {
      label: "Quiz",
      icon: <Award className="h-5 w-5" />,
      path: "/quiz",
    },
    {
      label: "Settings",
      icon: <SettingsIcon className="h-5 w-5" />,
      path: "/settings",
    },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
        >
          {item.icon}
          <span className="text-xs mt-0.5">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
