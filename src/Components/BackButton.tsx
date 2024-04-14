import React from 'react';
import { IonButton, IonButtons, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { arrowBack, heart } from 'ionicons/icons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db } from '../Server/Firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { auth } from '../Server/Firebase';

interface BackButtonProps {
  setShowSignUpForm: React.Dispatch<React.SetStateAction<boolean>>;
  id?: string; // Make id prop optional
  article: Article | null; // Define article prop
}

interface Article {
  id: string;
  likes: string[]; // Assuming likes is an array of user IDs
}

const BackButton: React.FC<BackButtonProps> = ({ setShowSignUpForm, id, article }) => {
  const [user] = useAuthState(auth);

  const handleLike = () => {
    if (!user) {
      setShowSignUpForm(true); // Show sign-up form if user is not logged in
      return;
    }

    if (article) {
      const articleLikes = article.likes || [];
      const userLiked = articleLikes.includes(user.uid);

      const updatedLikes = userLiked
        ? articleLikes.filter((uid) => uid !== user.uid) // Remove user's like
        : [...articleLikes, user.uid]; // Add user's like

      if (id) {
        updateDoc(doc(db, 'products', id), { likes: updatedLikes })
          .then(() => {
            console.log(userLiked ? 'Unliked' : 'Liked');
          })
          .catch((error: any) => {
            console.error('Error updating document: ', error);
          });
      }
    }
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous location in history
  };

  return (
    <IonToolbar>
      <IonButtons slot="start">
        <IonButton onClick={handleBack}>
          <IonIcon icon={arrowBack} />
          Back
        </IonButton>
      </IonButtons>
      <IonTitle>
        Tech Sea
      </IonTitle>
     <div className='md:flex md:justify-end md:p-[10px] md:items-center md:block hidden '>
     <IonIcon
          icon={heart}
          className="text-4xl "
          style={{
            cursor: 'pointer',
            color:
              article?.likes && user?.uid && article.likes.includes(user.uid) ? 'red' : undefined,
          }}
          onClick={handleLike}
        />
        <p className="font-bold mt-[5px] ml-[5px]">{article?.likes.length} likes</p>
     </div>
    </IonToolbar>
  );
};

export default BackButton;
