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
} from '@ionic/react';
import { search, close, home, lockClosed, mailOutline, helpCircleOutline } from 'ionicons/icons';
import { moon, sunny } from 'ionicons/icons';

interface NavbarProps {
  handleCategoryClick: (category: string) => void;
  categories: { id: string; name: string }[];
  scrollToBottom: () => void;
}

const Navbar: React.FunctionComponent<NavbarProps> = ({ handleCategoryClick, categories, scrollToBottom }) => {
  const [myModal, setMyModal] = useState({ isOpen: false });
  const [themeToggle, setThemeToggle] = useState(false);
  const [isOpens, setIsOpens] = useState(false);

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
              <IonIcon icon={home} />
              <p style={{ marginLeft: "10px", marginTop: "9px" }}>Home</p>
            </IonItem>
            <IonItem style={{ margin: "10px", background: "#000012" }} >
              <IonIcon icon={mailOutline} />
              <p style={{ marginLeft: "10px", marginTop: "9px" }}>Contact Us</p>
            </IonItem>
            <IonItem style={{ margin: "10px", background: "#000012" }} >
              <IonIcon icon={helpCircleOutline} />
              <p style={{ marginLeft: "10px", marginTop: "9px" }}>About Us</p>
            </IonItem>
            <IonItem style={{ margin: "10px", background: "#000012" }} >
              <IonIcon icon={lockClosed} />
              <p style={{ marginLeft: "10px", marginTop: "9px" }}>Privacy Policy</p>
            </IonItem>
       
            <div className='md:hidden block'>
              <IonItem style={{ margin: "10px", background: "#000012" }}>
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
                <IonButton onClick={() => setIsOpens(true)} style={{ fontSize: "14px", marginLeft: "-6px" }} fill='clear' >Categories</IonButton>
              </div>
              <IonActionSheet
                isOpen={isOpens}
                header="Categories"
                onDidDismiss={() => setIsOpens(false)}
                buttons={[
                  {
                    text: 'All Courses',
                    role:"cancel",
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
              <IonSearchbar style={{ padding: "10px", width: "50%" }} onClick={() => setMyModal({ isOpen: true })} placeholder='Search in Tech Sea' className='hidden md:block'></IonSearchbar>
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
          </IonModal>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Navbar;
