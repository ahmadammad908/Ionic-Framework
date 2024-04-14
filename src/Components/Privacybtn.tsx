import { IonButton, IonButtons, IonTitle, IonToolbar ,IonIcon} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { arrowBack } from 'ionicons/icons';

const Privacybtn = () => {
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
      <IonTitle className='font-bold'>Privacy Policy</IonTitle>
    </IonToolbar>
  );
};

export default Privacybtn;
