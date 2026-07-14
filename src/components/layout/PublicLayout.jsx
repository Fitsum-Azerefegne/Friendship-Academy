import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { PublicLangProvider } from "../../context/PublicLangContext";

export default function PublicLayout() {
  const location = useLocation();

  return (
    <PublicLangProvider>
      <div className="flex min-h-screen flex-col bg-paper">
        <Navbar />
        <main key={location.pathname} className="flex-1 animate-fade-in">
          <Outlet />
        </main>
        <Footer />
      </div>
    </PublicLangProvider>
  );
}
