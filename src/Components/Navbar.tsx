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
  IonLabel,
  IonActionSheet
} from '@ionic/react';
import { search, close } from 'ionicons/icons';
import { moon, sunny } from 'ionicons/icons';

const Example: React.FunctionComponent = () => {
  const [myModal, setMyModal] = useState({ isOpen: false });
  const [themeToggle, setThemeToggle] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpens, setIsOpens] = useState(false); // Corrected variable name

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
            <IonItem>
              <IonLabel>About Us</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Contact US</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Blogs</IonLabel>
            </IonItem>
            <IonItem className='md:hidden block'>
              <IonButton onClick={() => setIsOpens(true)} style={{ fontSize: "14px", marginLeft: "-6px" }} fill='clear' >Categories</IonButton>
              <IonActionSheet
                isOpen={isOpens} // Corrected variable name
                header="Categories"
                buttons={[
                  {
                    text: 'Software Engineering',
                    data: {
                      action: 'share',
                    },
                  },
                  {
                    text: 'Artificial Intelligence',
                  },
                  {
                    text: 'Data Science',
                  },
                  {
                    text: 'Design',
                  },
                  {
                    text: 'Marketing',
                  },
                  {
                    text: 'Cancel',
                    role: 'destructive',
                  },
                ]}
                onDidDismiss={() => setIsOpens(false)} // Corrected variable name
              ></IonActionSheet>
            </IonItem>
           <div className='md:hidden block'>
           <IonItem>
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
            <IonTitle style={{ textAlign: "start", paddingLeft: "50px" }} className="overflow-hidden overflow-ellipsis overflow-x-hidden">Tech Sea</IonTitle>
            <div className='hidden md:block md:flex md:justify-center'>
              <IonButton onClick={() => setIsOpen(true)} style={{ fontSize: "14px" }} className='lg:block md:hidden' fill='clear' >Categories</IonButton>
              <IonActionSheet
                isOpen={isOpen}
                header="Categories"
                buttons={[
                  {
                    text: 'Software Engineering',
                    data: {
                      action: 'share',
                    },
                  },
                  {
                    text: 'Artificial Intelligence',
                  },
                  {
                    text: 'Data Science',
                  },
                  {
                    text: 'Design',
                  },
                  {
                    text: 'Marketing',
                  },
                  {
                    text: 'Cancel',
                    role: 'destructive',
                  },
                ]}
                onDidDismiss={() => setIsOpen(false)}
              ></IonActionSheet>
              <IonSearchbar style={{ padding: "10px", width: "50%" }} onClick={() => setMyModal({ isOpen: true })} placeholder='Search in Tech Sea'></IonSearchbar>
              <div style={{ display: "flex" }}>
                <IonButton fill="outline">Login</IonButton>
                <IonButton className='ml-[10px]'>SignUp</IonButton>
              </div>
            </div>
            <IonIcon icon={themeToggle ? moon : sunny} style={{ color: themeToggle ? 'orange' : 'orange', marginTop: "22px" }} slot='end' className='moon' />
            <IonToggle
              checked={themeToggle}
              onIonChange={toggleDarkMode}
              slot="end"
              style={{ margin: '10px', marginTop: "15px" }}
            >
            </IonToggle>
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
              ></IonSearchbar>
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

export default Example;
