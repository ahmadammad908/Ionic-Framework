import './App.css';
import '@ionic/react/css/core.css';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter
import Blog from './Components/CourseData';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import { useState, useEffect } from 'react';
import {createRef} from 'react';
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
import Home from './Components/Home';
import { getTheme, isIos, setTheme } from "./Utils/Utils";
import { db } from './Server/Firebase';
import { collection, onSnapshot, query, QuerySnapshot, where, Unsubscribe } from 'firebase/firestore';
import CategoriesPage from './Components/CategoriesPage';
import BackButton from './Components/BackButton';

interface Article {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface Category {
  id: string;
  name: string;
}
const contentRef = createRef<HTMLIonContentElement>();
const scrollToBottom = () => {
  // Passing a duration to the method makes it so the scroll slowly
  // goes to the bottom instead of instantly
  contentRef.current?.scrollToBottom(500);
};
//////////////////////IOS////////////////////////////////////////////////////////////////////////////////IOS./////////////////////////////////////////

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
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  useEffect((): Unsubscribe | void => {
    const fetchCategories = async () => {
      const categoryRef = collection(db, 'categories');
      const q = query(categoryRef);

      const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
        const updatedCategories: Category[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name as string,
        }));
        setCategories(updatedCategories);
      });

      return unsubscribe;
    };

    fetchCategories();
  }, []);

  useEffect((): Unsubscribe | void => {
    const fetchData = async () => {
      const articleRef = collection(db, 'products');
      let q = query(articleRef);

      if (currentCategory) {
        q = query(articleRef, where('category', '==', currentCategory));
      }

      const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
        const updatedArticles: Article[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title as string,
          description: doc.data().description as string,
          imageUrl: doc.data().imageUrl as string,
        }));
        setArticles(updatedArticles);
        setLoading(false);
      });

      return unsubscribe;
    };

    fetchData();
  }, [currentCategory]);

  // const handleCategoryClick = (category: string) => {
  //   setCurrentCategory(category);
    const handleCategoryClick = (category: string) => {
      if (category === 'All Courses') {
        setCurrentCategory(null); // Reset to null to fetch all articles
      } else {
        setCurrentCategory(category);
      }
    };

    // If you want to do something else on category click, you can add more logic here
  
    // This is just an example, you can modify this based on your route structure
    
  

  return (
    <>
      <IonApp>
        <Navbar categories={categories} handleCategoryClick={handleCategoryClick} scrollToBottom={scrollToBottom}  />
        <Router>
          <IonRouterOutlet>
            <Routes>
              <Route path="/" element={<Content loading={loading} articles={articles} categories={categories} handleCategoryClick={handleCategoryClick} />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path='/blog/:id' element={<Blog />}></Route>
              <Route path="/cat" element={<CategoriesPage loading={loading} articles={articles} />}></Route>
              <Route path="/home" element={<Home />}></Route>
              <Route path='/back' element={<BackButton/>}></Route>
            </Routes>
          </IonRouterOutlet>
        </Router>
      </IonApp>
    </>
  );
}

export default App;
