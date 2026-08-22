import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import Services from "../components/home/Services";
import Navbar from "../components/layout/Navbar";
import UploadResumeCard from "../components/layout/UploadResumeCard";
import Footer from "../components/layout/Footer.";

const Home = () => {
  return (
    <div className="scroll-smooth">
      <Navbar />

      <section id="home" className="scroll-mt-20">
        <Hero />
      </section>

      <section id="features" className="scroll-mt-20">
        <Services />
      </section>

      <section id="upload-resume" className="scroll-mt-20">
        <UploadResumeCard />
      </section>

      <section id="how-it-works" className="scroll-mt-20">
        <HowItWorks />
      </section>

      <Footer />
    </div>
  );
};

export default Home;
