import Header from "./components/Header/Header.jsx";
import HomeText from "./components/HomeText/HomeText.jsx";
import HomeSection from "./components/HomeSection/HomeSection.jsx";
import "./App.css";

function App() {
  return (
    <>
      <div className="firstSection">
        <Header />
        <HomeText />
      </div>
      <HomeSection />
    </>
  );
}

export default App;
