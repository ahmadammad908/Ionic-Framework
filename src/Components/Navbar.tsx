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
  IonInput,
  IonSkeletonText,
} from '@ionic/react';

import { search, close, eye, eyeOff, moon, sunny, personCircleOutline } from 'ionicons/icons';

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import { auth } from "../Server/Firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Google from "../assets/images/Google.png"

import "react-toastify/dist/ReactToastify.css";

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
  const [isOpen, setIsOpen] = useState(false);

  const [showNoResults, setShowNoResults] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [user, setUser] = useState<any>(null);


  // State to hold user info
  const [selectedCategory, setSelectedCategory] = useState<string>('All Courses'); // Selected category state

  let navigate = useNavigate();


  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      // Check if displayName is not null before updating profile
      if (userCredential.user.displayName !== null) {
        await updateProfile(userCredential.user, {
          displayName: userCredential.user.displayName,
        });
      }

      // localStorage.setItem('loggedInUserEmail', userCredential.user.email);
      setTimeout(() => {
        setShowSignUpForm(false);
      }, 2000);
      toast.success("Sign up with Google successful!");
    } catch (err: any) {
      console.error('Google Sign Up error:', err.message);
      toast.error(err.message);
    }
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

    // Check user authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Check if there's a selected category in local storage
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      setSelectedCategory(savedCategory);
      handleCategoryClick(savedCategory);
    }

    return () => unsubscribe();
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
    setSelectedCategory(category); // Set the selected category
    localStorage.setItem('selectedCategory', category); // Save to local storage
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
        setShowNoResults(false);
        return;
      }

      setLoading(true);

      setTimeout(async () => {
        const q = query(collection(firestore, 'products'),
          where("title", ">=", value),
          where("title", "<=", value.toLowerCase() + "\uf8ff")
        );

        const snapshot = await getDocs(q);

        const suggestionsArray: any[] = [];
        snapshot.forEach((doc: any) => {
          suggestionsArray.push({
            id: doc.id,
            title: doc.data().title,
            content: doc.data().content,
            videoUrl: doc.data().videoUrl,
          });
        });

        setSuggestions(suggestionsArray);

        if (suggestionsArray.length === 0) {
          setShowNoResults(true);
        } else {
          setShowNoResults(false);
        }

        setLoading(false);
      }, 1000);

    } catch (err: any) {
      console.error('Error getting documents', err);
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
  };

  const handleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
    setShowSignUpForm(false); // Close SignUp form
  };

  const handleLogin = async () => {
    try {
      // Check if any of the fields are empty
      if (!email || !password) {
        toast.error("Please fill out all fields");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      localStorage.setItem('loggedInUserEmail', email);

      setTimeout(() => {
        setShowLoginForm(false);
      }, 2000)
      setEmail('');
      setPassword('');
      toast.success("Welcome Back")

      // Redirect to home page after successful login
      navigate("/");
    } catch (err: any) {
      console.error('Login error:', err.message);
      toast.error(err.message);
    }
  };

  const handleSignUpForm = () => {
    setShowSignUpForm(!showSignUpForm);
    setShowLoginForm(false); // Close Login form
  };

  const closeMenu = () => {
    const menu = document.querySelector('ion-menu');
    menu && menu.close();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async () => {
    try {
      // Check if any of the fields are empty
      if (!name || !signupEmail || !signupPassword) {
        toast.error("Please fill out all fields");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      await updateProfile(userCredential.user, { displayName: name });

      localStorage.setItem('loggedInUserEmail', signupEmail);

      setTimeout(() => {
        setShowSignUpForm(false);
      }, 2000);
      toast.success("Sign up successful!");
      navigate("/"); // Redirect to home page after signup
    } catch (err: any) {
      console.error('Sign up error:', err.message);
      toast.error(err.message);
    }
  };

  const handleNameChange = (event: CustomEvent) => {
    const value = (event.target as HTMLInputElement).value;
    setName(value);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Logged out successfully!");
      localStorage.removeItem('loggedInUserEmail');
      navigate("/");
    } catch (err: any) {
      console.error('Logout error:', err.message);
      toast.error(err.message);
    }
  };


  const defaultPhotoURL = 'https://media.licdn.com/dms/image/D4D03AQFbxcSgXEjgIw/profile-displayphoto-shrink_200_200/0/1706532939017?e=2147483647&v=beta&t=uZ8dR8vLg6SHWI4dUJrRz92qhpiWsJo0EaFsjw8rCuk';

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            {
              user ? (
                <>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '8px', cursor: "pointer" }} onClick={() => setIsOpen(true)} />
                  ) : (
                    <>
                      <div onClick={() => setIsOpen(true)}>
                        <img src={defaultPhotoURL} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '8px', cursor: "pointer" }} />

                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div onClick={handleSignUpForm} >
                    <IonIcon icon={personCircleOutline} style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '8px', cursor: "pointer" }} color='primary' className='mt-[5px]' />
                  </div>
                </>
              )
            }
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
              {
                user ? (
                  <>
                    <IonItem>
                      <IonButton fill="outline"
                        onClick={handleLogout}>Logout</IonButton>
                    </IonItem>
                  </>
                ) : (
                  <>
                    <IonItem style={{ background: "#000012" }}>
                      <IonButton fill="outline" onClick={handleLoginForm}>Login</IonButton>
                      <IonButton className='ml-[10px]' onClick={handleSignUpForm}>SignUp</IonButton>

                    </IonItem></>
                )
              }
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
                <IonButton onClick={() => setIsOpens(true)} style={{ fontSize: "14px", marginLeft: "-6px", marginTop: "5.9px" }} fill='clear' >{selectedCategory ? `${selectedCategory}` : 'categories'}</IonButton>
              </div>
              <IonActionSheet
                isOpen={isOpens}
                header="Categories"
                onDidDismiss={() => setIsOpens(false)}
                buttons={[
                  {
                    text: 'All Categories',
                    role: "cancel",
                    handler: () => {
                      handleCategorySheetClick('All Categories');
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

                {user ? (
                  <>

                    <IonButton fill="outline" className='hidden md:block' onClick={handleLogout}>Logout</IonButton>
                  </>
                ) : (
                  <>
                    <IonButton fill="outline" className='hidden md:block' onClick={handleLoginForm}>Login</IonButton>
                    <IonButton className='ml-[10px] hidden md:block' onClick={handleSignUpForm}>SignUp</IonButton>
                  </>
                )}
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

            <div style={{ top: "10px" }} className='min-h-[100vh]'>
              <IonList>
                {loading ? (
                  <div className='m-[20px]'>
                    <IonSkeletonText animated style={{ width: '100%', height: '20px' }} />
                    <IonSkeletonText animated style={{ width: '100%', height: '20px' }} />
                    <IonSkeletonText animated style={{ width: '100%', height: '20px' }} />
                    <IonSkeletonText animated style={{ width: '100%', height: '20px' }} />
                    <IonSkeletonText animated style={{ width: '100%', height: '20px' }} />
                  </div>
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

          {/* Login Form Modal */}
          <IonModal isOpen={showLoginForm} onDidDismiss={() => setShowLoginForm(false)} style={{ width: "100%", }}>
            <IonContent className="ion-padding">

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} className=' mt-[50px]'>
                <ToastContainer />

                <div className='flex justify-center text-3xl' style={{ marginBottom: "30px" }}>
                  <h1 className='text-3xl font-bold text-center'>Log in to your <span className='text-blue-400'>Tech Sea</span> account</h1>
                </div>
                <IonList style={{ maxWidth: "500px", width: "100%" }}>
                  <IonItem>
                    <IonInput label="Email" labelPlacement="floating" fill="outline" type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} className='font-bold'></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonInput label="Password" labelPlacement="floating" fill="outline" type={showPassword ? 'text' : 'password'} value={password} onIonChange={(e) => setPassword(e.detail.value!)} className='font-bold'>
                    </IonInput>
                    <IonIcon slot="end" icon={showPassword ? eyeOff : eye} onClick={togglePasswordVisibility} />

                  </IonItem>
                  <IonButton expand="block" onClick={handleLogin} style={{ marginTop: "20px" }} className='font-bold'>Login</IonButton>
                  <IonButton expand="block" onClick={handleLoginForm} color={"danger"} style={{ marginTop: "10px" }}>Cancel</IonButton>

                </IonList>
              </div>
            </IonContent>
          </IonModal>

          {/* SignUp Form Modal */}
          <IonModal isOpen={showSignUpForm} onDidDismiss={() => setShowSignUpForm(false)}style={{ width: "100%", }}>
            <IonContent className="ion-padding" id='overflow-hidden'>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} className=' mt-[10px]  '>
                <ToastContainer />

                <div className=' text-3xl' style={{ marginBottom: "20px" }}>
                  <h1 className='text-3xl font-bold text-center '>Create an <span className='text-blue-400'>Tech Sea</span> account</h1>
                </div>
                <IonList style={{ maxWidth: "500px", width: "100%" }}>
                  <IonItem>
                    <IonInput label="Name" labelPlacement="floating" fill="outline" type="text" value={name} onIonChange={(e) => handleNameChange(e)} className='font-bold'></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonInput label="Email" labelPlacement="floating" fill="outline" type="email" value={signupEmail} onIonChange={(e) => setSignupEmail(e.detail.value!)} className='font-bold'></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonInput label="Password" labelPlacement="floating" fill="outline" type={showPassword ? 'text' : 'password'} value={signupPassword} onIonChange={(e) => setSignupPassword(e.detail.value!)} className='font-bold'></IonInput>
                    <IonIcon slot="end" icon={showPassword ? eyeOff : eye} onClick={togglePasswordVisibility} />

                  </IonItem>
                  <IonButton expand="block" onClick={handleSignUp} style={{ marginTop: "20px" }} className='font-bold'>Sign Up</IonButton>
                  <div className='text-center'>
                    <img src={Google} style={{ width: "30px", position: "absolute", zIndex: "20", marginTop: "10px", }} className='md:ml-[140px]  ml-[40px]'></img>
                    <IonButton expand="block" onClick={handleGoogleSignUp} style={{ marginTop: "10px" }} className='font-bold ' color={"dark"}>Sign Up in Google</IonButton>
                  </div>
                  <IonButton expand="block" onClick={handleSignUpForm} color="danger" style={{ marginTop: "10px" }} className='font-bold'>Cancel</IonButton>
                </IonList>
              </div>
            </IonContent>
          </IonModal>

          <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>User Profile</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              {
                user ? (
                  <>
                    <div className='flex justify-center'>
                      {/* <img src={user.photoURL} style={{ borderRadius: "50%" }}></img> */}
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" style={{  borderRadius: '50%', marginRight: '8px', cursor: "pointer" }} onClick={() => setIsOpen(true)} />
                      ) : (
                        <>
                          <div onClick={() => setIsOpen(true)}>
                            <img src={defaultPhotoURL} alt="Profile" style={{ width:"80px", borderRadius: '50%', marginRight: '8px', cursor: "pointer" }} />

                          </div>
                        </>
                      )}
                    </div>

                    <div className=''>
                      <IonList className='mt-[20px] ml-[-20px]'>
                        <IonItem className='font-bold '>
                          Name :
                          <IonLabel class='text-end'>{user.displayName}</IonLabel>
                        </IonItem>
                      </IonList>
                      <IonList className='mt-[20px] ml-[-20px]'>
                        <IonItem className='font-bold '>
                          Email :
                          <IonLabel class='text-end truncate'>{user.email}</IonLabel>
                        </IonItem>
                      </IonList>
                      <IonList className='mt-[20px] ml-[-20px]'>
                        <IonItem className='font-bold '>
                          User Uid :
                          <IonLabel class='text-end truncate'>  {user.uid}</IonLabel>
                        </IonItem>
                      </IonList>
                      <IonList >
                        <IonButton className='mt-[20px] font-bold' expand="block" color={"danger"} onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}>Logout</IonButton>
                      </IonList>




                    </div>
                  </>

                ) : (
                  <>
                  </>
                )
              }
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Navbar;
