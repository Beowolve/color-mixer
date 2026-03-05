import "./styles.css";

import ColorMixer from "./components/ColorMixer.js";
import "./components/ColorMixer.css";

export default function App() {
  return (
    <div className="App">
      <div className="top"></div>

      <div className="content">
        <h1>Color Mixer</h1>
        <ColorMixer></ColorMixer>
        <div className="infoText">You can click the color code to copy it!</div>
      </div>
      <footer className="footer">
        <a href="https://www.flaticon.com/free-icons/rgb" title="rgb icons">
          Rgb icons created by Freepik - Flaticon
        </a>
      </footer>
    </div>
  );
}
