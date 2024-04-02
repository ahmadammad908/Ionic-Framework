import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonSearchbar,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonMenu,
  IonToggle,
  IonMenuButton,
  IonList,
  IonItem,
  IonActionSheet,
  IonLabel,
  IonSpinner
} from '@ionic/react';
import { search, close } from 'ionicons/icons';
import { moon, sunny } from 'ionicons/icons';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Link } from 'react-router-dom';

interface NavbarProps {
  handleCategoryClick: (category: string) => void;
  categories: { id: string; name: string }[];
  scrollToBottom: () => void;
}

const Navbar: React.FunctionComponent<NavbarProps> = ({ handleCategoryClick, categories, scrollToBottom }) => {
  const [myModal, setMyModal] = useState({ isOpen: false });
  const [themeToggle, setThemeToggle] = useState(false);
  const [isOpens, setIsOpens] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  // const handleBackClick = (event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => {
  //   event.preventDefault(); // Prevent default behavior
  //   navigate('/admin');
  // };


  const closeMenu = () => {
    const menu = document.querySelector('ion-menu');
    menu && menu.close();
  };

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme !== null) {
      setThemeToggle(savedTheme === 'dark');
      applyDarkMode(savedTheme === 'dark');
    } else {
      setThemeToggle(prefersDark);
      applyDarkMode(prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !themeToggle ? 'dark' : 'light';
    setThemeToggle(!themeToggle);
    applyDarkMode(!themeToggle);
    localStorage.setItem('theme', newTheme);
  };

  const applyDarkMode = (dark: boolean) => {
    const prefersDark = dark;
    const body = document.body;
    if (prefersDark) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  };

  const handleCategorySheetClick = (category: string) => {
    if (category === 'All Courses') {
      handleCategoryClick(category);
      scrollToBottom();
    } else {
      handleCategoryClick(category);
      scrollToBottom();
    }
    setIsOpens(false);
  };

  const firestore = getFirestore();

  const fetchSuggestions = async (value: string) => {
    try {
      if (value.trim() === '') {
        setSuggestions([]);
        setShowNoResults(false); // Clear "No results found" message
        return;
      }

      setLoading(true);
      const q = query(collection(firestore, 'products'),
        where("title", ">=", value),
        where("title", "<=", value.toLowerCase() + "\uf8ff")
      );

      const snapshot = await getDocs(q);

      const suggestionsArray: any[] = [];
      snapshot.forEach((doc: any) => {
        suggestionsArray.push({
          id: doc.id,
          title:doc.data().title,
          content: doc.data().content,
          videoUrl: doc.data().videoUrl,
        });
      });

      setSuggestions(suggestionsArray);

      if (suggestionsArray.length === 0) {
        setShowNoResults(true); // Show "No results found" message
      } else {
        setShowNoResults(false); // Hide "No results found" message
      }
    } catch (err) {
      console.error('Error getting documents', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: CustomEvent) => {
    const value = (event.target as HTMLInputElement).value;
    setSearchValue(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchValue(suggestion.title);
    setSuggestions([]);
    // You can do something with the selected suggestion, like perform a search
  };

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Tech Sea</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={closeMenu}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem style={{ margin: "10px", background: "#000012" }} >
              Home
            </IonItem>
            <IonItem style={{ margin: "10px", background: "#000012" }} >
              Contact Us
            </IonItem>
            <IonItem style={{ margin: "10px", background: "#000012" }} >
              About Us
            </IonItem>
            <IonItem style={{ margin: "10px", background: "#000012" }} >
              Privacy Policy
            </IonItem>
            <IonItem>
              <Link to={"/admin"}> 
              <IonButton fill="outline" onClick={closeMenu}>Admin Panel</IonButton>
              </Link>
            </IonItem>

            <div className='md:hidden block'>
              <IonItem style={{ background: "#000012"}}>
                <IonButton fill="outline">Login</IonButton>
                <IonButton className='ml-[10px]'>SignUp</IonButton>
              </IonItem>
            </div>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
        <IonHeader class='ion-header'>
          <IonToolbar className={themeToggle ? 'dark-header' : ''}>
            <IonButtons slot="start">
              <IonMenuButton style={{ marginTop: "12px" }} />
            </IonButtons>
            <IonTitle style={{ textAlign: "start", paddingLeft: "50px" }} className="overflow-hidden overflow-ellipsis overflow-x-hidden" id='title'>Tech Sea</IonTitle>
            <div className=' md:flex md:justify-center '>
              <div className='flex justify-end'>
                <IonButton onClick={() => setIsOpens(true)} style={{ fontSize: "14px", marginLeft: "-6px", marginTop: "5.9px" }} fill='clear' >Categories</IonButton>
              </div>
              <IonActionSheet
                isOpen={isOpens}
                header="Categories"
                onDidDismiss={() => setIsOpens(false)}
                buttons={[
                  {
                    text: 'All Courses',
                    role: "cancel",
                    handler: () => {
                      handleCategorySheetClick('All Courses');
                    }
                  },
                  ...(categories || []).map((category) => ({
                    text: category.name,
                    handler: () => {
                      console.log('Category clicked:', category.name);
                      handleCategorySheetClick(category.name);
                    }
                  })),

                  {
                    text: 'Cancel',
                    role: 'destructive'
                  }
                ]}
              />
              <IonSearchbar
                style={{ padding: "10px", width: "50%" }}
                onClick={() => setMyModal({ isOpen: true })}
                placeholder='Search in Tech Sea'
                value={searchValue}
                onIonInput={handleSearchChange} // Change here from onIonChange to onIonInput
                className='hidden md:block'
              />
              <div style={{ display: "flex" }}>

                <IonButton fill="outline" className='hidden md:block'>Login</IonButton>
                <IonButton className='ml-[10px] hidden md:block'>SignUp</IonButton>
              </div>
            </div>
            <IonIcon icon={themeToggle ? moon : sunny} style={{ color: themeToggle ? 'orange' : 'orange', marginTop: "22px" }} slot='end' className='moon' />
            <IonToggle
              checked={themeToggle}
              onIonChange={toggleDarkMode}
              slot="end"
              style={{ margin: '10px', marginTop: "15px" }}
            />
            <IonButtons slot="end" className='md:hidden block mt-[14px]'>
              <IonButton onClick={() => setMyModal({ isOpen: true })}>
                <IonIcon icon={search} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonModal isOpen={myModal.isOpen}>
            <IonToolbar>
              <IonSearchbar
                value={searchValue}
                onIonInput={handleSearchChange} // Change here from onIonChange to onIonInput
                showCancelButton="never"
                placeholder="Search in Tech Sea"
                style={{ marginTop: "10px" }}
              />
              <IonButtons slot="end">
                <IonButton onClick={() => setMyModal({ isOpen: false })} style={{ color: "#3880FF80", marginTop: "10px" }}>
                  Cancel
                </IonButton>
              </IonButtons>
            </IonToolbar>
            <div style={{ top: "20px" }} className='min-h-[100vh]'>
              <IonList>
                {loading ? (
                  <IonItem>
                    <IonLabel className='font-bold '>Loading...</IonLabel>
                    <IonSpinner name="lines" color="primary" />

                  </IonItem>
                ) : showNoResults ? (
                  <div className=''>
                    <IonItem>
                      <IonLabel style={{ color: "#EB445A" }} className='font-bold '>No results found</IonLabel>

                      <IonButton color={"danger"} onClick={() => setMyModal({ isOpen: false })} >Retry</IonButton>
                    </IonItem>

                  </div>
                ) : (
                  suggestions.map((suggestion, id) => (
                    <div key={id}>
                      <Link to={`/blog/${suggestion.id}`}>
                        <IonItem onClick={() => handleSuggestionClick(suggestion)}>
                          <IonLabel className='font-bold '>{suggestion.title}</IonLabel>
                        </IonItem>
                      </Link>
                    </div>
                  ))
                )}
              </IonList>
            </div>
          </IonModal>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Navbar;
