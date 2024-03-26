import './App.css';
import '@ionic/react/css/core.css';
import { IonApp,setupIonicReact } from '@ionic/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter
import Blog from './Components/CourseData';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import Navbar from './Components/Navbar';
import Content from './Components/Courses';
import AdminPanel from './Components/AdminPanel';
// import Home from './Components/Home';
import { getTheme, isIos, setTheme } from "../src/Utils/Utils";


const mode = new URLSearchParams(window.location.search).get("mode");

if (mode) {
  setupIonicReact({
    mode: mode as any,
  });
} else {
  // If android, use md mode
  if (!isIos) {
    setupIonicReact({
      mode: "md",
    });
  } else {
    // Ios everywhere else
    setupIonicReact({
      mode: "ios",
    });
  }
}

setTheme(getTheme());

function App() {
  return (
    <IonApp>
     <Navbar/>
      <Router>
        
          <Routes>
            <Route path="/" element={<Content />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path='/blog/:id' element={<Blog/>}></Route>
         
          </Routes>
        
      </Router>
    </IonApp>
  );
}

export default App;
