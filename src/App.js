import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import FaceRecognition from "./pages/reconhecimento";
import ResultPage from "./pages/resultado";

function App() {
  return(
    <BrowserRouter>
      <Routes>
      <Route index path="/" element={<FaceRecognition />} />
      <Route path="/resultado-amf-games" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
