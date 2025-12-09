import Title from "../Title/Title";
import Gallery from "../Gallery/Gallery";
import Slider from "../Slider/Slider";
import Video from "../Video/Video";

// Главная страница
const MainPage: React.FC = () => {
  return (
    <div>
      <Title />
      <Gallery />
      <Slider />
      <Video />
    </div>
  );
};

export default MainPage;
