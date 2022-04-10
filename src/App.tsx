import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Top } from './Top';
import { Sketch_1 } from './Sketch_1';
import { Sketch_2 } from './Sketch_2';
import { Sketch_3 } from './Sketch_3';
import { Sketch_4 } from './Sketch_4';

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
        </Routes>
      </Router>
    </>
  );
}

export default App;
