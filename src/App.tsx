import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Top } from "./Top";
import { Sketch_1 } from "./Sketch_1";
import { Sketch_2 } from "./Sketch_2";
import { Sketch_3 } from "./Sketch_3";
import { Sketch_4 } from "./Sketch_4";
import { Sketch_5 } from "./Sketch_5";
import { Sketch_6 } from "./Sketch_6";
import {TopCanvas} from "./TopCanvas";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/1" element={<Sketch_1 />} />
          <Route path="/2" element={<Sketch_2 />} />
          <Route path="/3" element={<Sketch_3 />} />
          <Route path="/4" element={<Sketch_4 />} />
          <Route path="/5" element={<Sketch_5 />} />
          <Route path="/6" element={<Sketch_6 />} />
          <Route path="/page-canvas" element={<TopCanvas />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
