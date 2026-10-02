import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AIChatbot from "../components/ui/AIChatbot/AIChatbot";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <AIChatbot />
    </>
  );
}

export default MainLayout;