import Example from './Example'
import { Link } from 'react-router-dom'
import { IonButton, IonContent, IonHeader, IonPage, IonTitle } from '@ionic/react'
const Add = () => {
    return (
        <>
            <IonPage>
                <IonHeader>
                    <Example /> 

                </IonHeader>
                <IonContent>
                    <IonTitle style={{ height: "40vh" }}>
                        <h1 style={{ fontWeight: "bold" }}>Welcome in Add Sea</h1>
                        <Link to={"/"}>                  <IonButton fill="outline">Outline</IonButton>
                        </Link>
                    </IonTitle>

                </IonContent>
            </IonPage>
        </>
    )
}

export default Add