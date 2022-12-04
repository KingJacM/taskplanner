import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Tasks from './components/Tasks/Tasks';
import Create from './components/Create/Create';
import Sidebar from './components/Sidebar';
import Grid from './components/Grid';

function App() {
  return (<>
    
    <Router>
    <div style={{display:"flex", margin:"auto"}}>
    <Sidebar>
    </Sidebar>
    <Routes>
      <Route path="/" element={<Tasks />}/>
      <Route path="/tasks" element={<Tasks />}/>
      <Route path="/createtask" element={<Create />}/>
      <Route path="/grid" element={<Grid />}/>
    </Routes>
    </div>
  </Router>
  </>
  );
}

export default App;
