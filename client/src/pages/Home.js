import HowItWorks from "../components/home/HowItWorks";
import Services from "../components/home/Services";
import Navbar from "../components/layout/Navbar";
import UploadResumeCard from "../components/layout/UploadResumeCard";

const Home = () => {
  return (
    <>
      <Navbar />
      <Services />
      <UploadResumeCard />
      <HowItWorks />
    </>
  );
};

export default Home;
