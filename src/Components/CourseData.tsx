import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../Server/Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import {
  IonContent, IonHeader, IonIcon, IonSkeletonText, IonButton,
  IonModal,
  IonList,
  IonItem,
  IonInput,
  IonLabel,
} from "@ionic/react";
import BackButton from "./BackButton";
import { heart, eye, eyeOff } from 'ionicons/icons';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Server/Firebase";
import Google from "../assets/images/Google.png"

interface Article {
  id: string;
  title: string;
  content: string;
  course: string;
  videoUrl: string | null;
  posterUrl: string | null;
  createdAt: { seconds: number; nanoseconds: number };
  paragraph: string;
  Outline: string;
  likes: string[]; // Assuming likes is an array of user IDs
}

const DEFAULT_POSTER_URL = "https://example.com/default-poster.jpg";

const Blog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");

  const [user] = useAuthState(auth);

  const handleNameChange = (event: CustomEvent) => {
    const value = (event.target as HTMLInputElement).value;
    setName(value);
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
      setShowSignUpForm(false);
      toast.success("Sign up successful!");
    } catch (err: any) {
      console.error('Sign up error:', err.message);
      toast.error(err.message);
    }
  };

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

      setShowSignUpForm(false);
      toast.success("Sign up with Google successful!");

    } catch (err: any) {
      console.error('Google Sign Up error:', err.message);
      toast.error(err.message);
    }
  };

  const handleLike = () => {
    if (!user) {
      setShowSignUpForm(true); // Show sign-up form if user is not logged in
      return;
    }

    if (article) {
      const articleLikes = article.likes || [];
      const userLiked = articleLikes.includes(user.uid);

      const updatedLikes = userLiked
        ? articleLikes.filter(uid => uid !== user.uid) // Remove user's like
        : [...articleLikes, user.uid]; // Add user's like

      if (id) {
        updateDoc(doc(db, "products", id), { likes: updatedLikes })
          .then(() => {
            console.log(userLiked ? "Unliked" : "Liked");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      }
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    const docRef = doc(db, "products", id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Article;
        setArticle({ ...data, id: snapshot.id });
      } else {
        console.log('Document does not exist!');
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const formatDate = (date: Date): string => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day}, ${month} ${date.getDate()}, ${year}`;
  };

  return (
    <>
      <IonContent>
        <IonHeader>
          <BackButton />
        </IonHeader>
        <div className="mt-[70px] border-red-200 md:flex md:flex-col md:items-center" >
          {loading ? (
            <>
              <div className="p-[10px] md:pl-[100px] text-center text-center w-[100%]">
                <IonSkeletonText animated style={{ height: "10vh", marginBottom: "10px", }} className="md:w-[70%] w-[100%]" />
                <IonSkeletonText animated style={{ height: "10vh", marginBottom: "10px" }} className="md:w-[70%] w-[100%]" />
                <IonSkeletonText animated style={{ height: "10vh", marginBottom: "10px" }} className="md:w-[70%] w-[100%]" />
                <IonSkeletonText animated style={{ height: "10vh", marginBottom: "10px" }} className="md:w-[70%] w-[100%]" />
                <IonSkeletonText animated style={{ height: "10vh", marginBottom: "10px" }} className="md:w-[70%] w-[100%]" />
                <IonSkeletonText animated style={{ height: "10vh", marginBottom: "10px" }} className="md:w-[70%] w-[100%]" />
                <IonSkeletonText animated style={{ height: "10vh", marginBottom: "10px" }} className="md:w-[70%] w-[100%]" />
              </div>
            </>
          ) : (
            <>
              <div className="p-[10px] md:pl-[100px] text-center md:text-start">
                <span className="badge text-white bg-amber-500 font-bold p-[10px] rounded"> Thoughts </span>
              </div>
              <div className="p-[10px] md:pl-[100px] text-center md:text-start">
                <h1 className="text-4xl lg:text-5xl font-bold lg:tracking-tight mt-1 lg:leading-tight font-myCustomCursive" id="family">{article?.Outline}</h1>
              </div>
              <div className="p-[10px] md:pl-[100px] text-start flex flex-wrap">
                {article?.createdAt && (
                  <p className="text-gray-400 font-bold ml-[30px] md:ml-[0px]" id="family">{formatDate(new Date(article.createdAt.seconds * 1000))}</p>
                )}
                <div className="w-full md:w-auto flex flex-wrap gap-3 mt-[20px] md:mt-[0px]">
                  <span className="badge badge-sm bg-pink-200 text-pink-800 ml-[30px] p-[3px] rounded">
                    #interviews
                  </span>
                  <span className="badge badge-sm bg-pink-200 text-pink-800 ml-[30px] p-[3px] rounded">
                    #recruiters
                  </span>
                  <span className="badge badge-sm bg-pink-200 text-pink-800 ml-[30px] p-[3px] rounded">
                    #coding-challenges
                  </span>
                  <span className="badge badge-sm bg-pink-200 text-pink-800 ml-[20px] p-[3px] rounded">
                    #programming
                  </span>
                </div>
              </div>
              
              <div className="mt-[30px] p-[10px] md:pl-[100px] prose prose-lg mt-6 max-w-7xl pl-[10px]">
                <IonList className="p-[10px] rounded leading-8" >
                    <IonLabel>{article?.paragraph}</IonLabel>
                </IonList>
                {/* <p className="font-bold text-gray-500" id="family">{article?.paragraph}</p> */}
              </div>
              <div className="mt-[30px] p-[10px] md:pl-[100px]">
                {article?.videoUrl && (
                  <video src={article.videoUrl} controls style={{ width: "1000px" }} poster={article.posterUrl || DEFAULT_POSTER_URL}></video>
                )}
              </div>
              <div className="mt-[10px] p-[10px] md:pl-[100px] flex pl-[20px] ">
                <IonIcon
                  icon={heart}
                  className="text-4xl "
                  style={{
                    cursor: "pointer",
                    color: article?.likes && user?.uid && article.likes.includes(user.uid) ? "red" : null,
                  }}
                  onClick={handleLike}
                />
                <p className="font-bold mt-[5px] ml-[10px]">{article?.likes.length} likes</p>
              </div>
              
              <div className="mt-[0px] p-[10px] md:pl-[100px] prose prose-lg mt-6 max-w-7xl ">
              <IonList className="p-[10px] rounded leading-8" >
                    <IonLabel>{article?.course}</IonLabel>
                </IonList>
              </div>
            </>
          )}
        </div>
      </IonContent>
      <IonModal isOpen={showSignUpForm} style={{ width: "100%" }}>
        <IonContent className="ion-padding">

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} className=' mt-[20px] '>
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

              <IonButton expand="block" onClick={() => setShowSignUpForm(false)} color="danger" style={{ marginTop: "10px" }}>Cancel</IonButton>

            </IonList>
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};

export default Blog;
