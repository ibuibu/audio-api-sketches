import { Top } from './Top';
import { Sketch_1 } from './Sketch_1';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sketch_2 } from './Sketch_2';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/1" element={<Sketch_1 />} />
          <Route path="/2" element={<Sketch_2 />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
