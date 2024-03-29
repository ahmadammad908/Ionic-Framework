import { IonBackButton, IonButtons, IonTitle, IonToolbar } from '@ionic/react';
const BackButton = () => {
    return (
        <>

            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton defaultHref="/"></IonBackButton>
                </IonButtons>
                <IonTitle>Tech Sea</IonTitle>

            </IonToolbar>

        </>
    )
}

export default BackButton