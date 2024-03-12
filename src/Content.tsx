import Example from './Example'
import { IonContent, IonHeader } from '@ionic/react'
import { IonCol, IonGrid, IonRow, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';

const Content = () => {
  return (
    <>

      <IonHeader>
        <Example /> {/* Isko yahan rakho */}
        {/* Header content here */}
      </IonHeader>
      <IonContent>
      <IonGrid style={{ marginTop: "100px" }}>
        <IonRow style={{ }}>
          <IonCol size="6" size-md="4" size-lg="2" style={{ color: "white" }}>
            <IonCard className='ion-activatable recipe group hover:scale-95 ios hover:border-4 hover:border-blue-700'>
              <img alt="Silhouette of mountains" src="https://media.licdn.com/dms/image/D5612AQHSONjiC_COsw/article-cover_image-shrink_720_1280/0/1691237436149?e=2147483647&v=beta&t=BaTPnukG-6IavUojvPg4PQPpvCu9Q4xKF_APUMfzW6s" className='h-[15vh] w-[100%]'/>
              <IonCardHeader>
                <IonCardTitle className='  md:text-[1.5vw] text-[5vw]'>React Js</IonCardTitle>
                <IonCardSubtitle className='md:text-[0.7vw] text-[2.5vw]'>Free Course</IonCardSubtitle>
              </IonCardHeader>

            </IonCard>
          </IonCol>
          <IonCol size="6" size-md="4" size-lg="2" style={{  color: "white" }}>
            <IonCard className='ion-activatable recipe group hover:scale-95 ios hover:border-4 hover:border-blue-700'>
              <img alt="Silhouette of mountains" src="https://bs-uploads.toptal.io/blackfish-uploads/components/seo/6001595/og_image/optimized/secure-rest-api-in-nodejs-18f43b3033c239da5d2525cfd9fdc98f.png" className='h-[15vh] w-[100%]'/>
              <IonCardHeader>
                <IonCardTitle className='md:text-[1.5vw] text-[5vw]'>Node JS</IonCardTitle>
                <IonCardSubtitle  className='md:text-[0.7vw] text-[2.5vw]'>Free Course</IonCardSubtitle>
              </IonCardHeader>

            </IonCard>
          </IonCol>
          <IonCol size="6" size-md="4" size-lg="2" style={{  color: "white" }} >
            <IonCard className='ion-activatable recipe group hover:scale-95 ios hover:border-4 hover:border-blue-700'>
              <img alt="Silhouette of mountains" src="https://miro.medium.com/v2/resize:fit:805/1*7fe7SkSNP6Y8PvTRm4Jl6Q.png" className='h-[15vh] w-[100%]'/>
              <IonCardHeader>
              <IonCardTitle className='  md:text-[1.5vw] text-[4vw]'>Express JS</IonCardTitle>

                <IonCardSubtitle  className='md:text-[0.7vw] text-[2.5vw]'>Free Course</IonCardSubtitle>
              </IonCardHeader>

            </IonCard>
          </IonCol>
          <IonCol size="6" size-md="4" size-lg="2" style={{ color: "white" }}>
            <IonCard className='ion-activatable recipe group hover:scale-95 ios hover:border-4 hover:border-blue-700'>
              <img alt="Silhouette of mountains" src="https://incubator.ucf.edu/wp-content/uploads/2023/07/artificial-intelligence-new-technology-science-futuristic-abstract-human-brain-ai-technology-cpu-central-processor-unit-chipset-big-data-machine-learning-cyber-mind-domination-generative-ai-scaled-1.jpg" className='h-[15vh] w-[100%]'/>
              <IonCardHeader>
              <IonCardTitle className='  md:text-[1.5vw] text-[5vw]'>Ai</IonCardTitle>

                <IonCardSubtitle  className='md:text-[0.7vw] text-[2.5vw]'>Free Course</IonCardSubtitle>
              </IonCardHeader>

            </IonCard>
          </IonCol>
          <IonCol size="6" size-md="4" size-lg="2" style={{  color: "white" }}>
            <IonCard className='ion-activatable recipe group hover:scale-95 ios hover:border-4 hover:border-blue-700'>
              <img alt="Silhouette of mountains" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJEKjJpDX8bjW0Aw5NMLPWkMKL42zkCyZ6a6-bevF0mQ&s" className='h-[15vh] w-[100%]' />
              <IonCardHeader>
              <IonCardTitle className='  md:text-[1.5vw] text-[5vw]'>Ui/UX</IonCardTitle>

                <IonCardSubtitle  className='md:text-[0.7vw] text-[2.5vw]'>Free Course</IonCardSubtitle>
              </IonCardHeader>

            </IonCard>
          </IonCol>
          <IonCol size="6" size-md="4" size-lg="2" style={{ color: "white" }}>
            <IonCard className='ion-activatable recipe group hover:scale-95 ios hover:border-4 hover:border-blue-700'>
              <img alt="Silhouette of mountains" src="https://miro.medium.com/v2/resize:fit:800/1*csEMmQ-po3jOFGMFAtwKrg.png" className='h-[15vh] w-[100%]'/>
              <IonCardHeader>
              <IonCardTitle className='  md:text-[1.2vw] text-[3vw] text-center'>Prompt Enginnering</IonCardTitle>

                <IonCardSubtitle  className='md:text-[0.7vw] text-[2.5vw]'>Free Course</IonCardSubtitle>
              </IonCardHeader>

            </IonCard>
          </IonCol>
          
        </IonRow>
      </IonGrid>
      </IonContent>
      


    </>
  )
}

export default Content