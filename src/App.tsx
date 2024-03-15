import './App.css';
import '@ionic/react/css/core.css';
import { IonApp,  IonRouterOutlet ,setupIonicReact } from '@ionic/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter

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
import Example from './Example';
import Content from './Content';
import Add from './Add';
import { getTheme, isIos, setTheme } from "../src/Utils";
// setupIonicReact()


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
     <Example/>
      <Router>
        <IonRouterOutlet>
          <Routes>
            {/* <Route path="/" element={<Content />} /> */}
            <Route path="/" element={<Content />} />
            <Route path="/add" element={<Add />} />
          </Routes>
        </IonRouterOutlet>
      </Router>
    </IonApp>
  );
}

export default App;
