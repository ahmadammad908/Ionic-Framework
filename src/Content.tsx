import  { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSkeletonText,
} from '@ionic/react';
import { Link } from 'react-router-dom';
import Example from './Example';

const cardData = [
  {
    title: 'React JS',
    subtitle: 'Free Course',
    image: 'https://media.licdn.com/dms/image/D5612AQHSONjiC_COsw/article-cover_image-shrink_720_1280/0/1691237436149?e=2147483647&v=beta&t=BaTPnukG-6IavUojvPg4PQPpvCu9Q4xKF_APUMfzW6s',
    link: '/add'
  },
  {
    title: 'Node JS',
    subtitle: 'Free Course',
    image: 'https://bs-uploads.toptal.io/blackfish-uploads/components/seo/6001595/og_image/optimized/secure-rest-api-in-nodejs-18f43b3033c239da5d2525cfd9fdc98f.png'
  },
  {
    title: 'Express JS',
    subtitle: 'Free Course',
    image: 'https://miro.medium.com/v2/resize:fit:805/1*7fe7SkSNP6Y8PvTRm4Jl6Q.png'
  },
  {
    title: 'AI',
    subtitle: 'Free Course',
    image: 'https://incubator.ucf.edu/wp-content/uploads/2023/07/artificial-intelligence-new-technology-science-futuristic-abstract-human-brain-ai-technology-cpu-central-processor-unit-chipset-big-data-machine-learning-cyber-mind-domination-generative-ai-scaled-1.jpg'
  },
  {
    title: 'UI/UX',
    subtitle: 'Free Course',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJEKjJpDX8bjW0Aw5NMLPWkMKL42zkCyZ6a6-bevF0mQ&s'
  },
  {
    title: 'Prompt Eng',
    subtitle: 'Free Course',
    image: 'https://miro.medium.com/v2/resize:fit:800/1*csEMmQ-po3jOFGMFAtwKrg.png'
  },
];

const Content = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this effect runs only once after the component mounts

  return (
    <>
      <IonHeader>
        <Example /> {/* Isko yahan rakho */}
        {/* Header content here */}
      </IonHeader>
      <IonContent>
        <IonGrid style={{ marginTop: "100px" }}>
          <IonRow>
            {cardData.map((card, index) => (
              <IonCol key={index} size="6" size-md="4" size-lg="2" style={{ color: "white" }}>
                <Link to={card.link || '/'}>
                  <IonCard className='ion-activatable recipe group hover:scale-95 ios hover:border-4 hover:border-blue-700 '>
                    {loaded ? (
                      <img alt={`Image for ${card.title}`} src={card.image} className='h-[15vh] w-[100%]' />
                    ) : (
                      <IonSkeletonText animated className="skeleton-image" style={{ height: '15vh', width: '100%' }} />
                    )}
                    <IonCardHeader>
                      {loaded ? (
                        <>
                          <IonCardTitle className='md:text-[1.1vw] text-[3vw] text-center'>{card.title}</IonCardTitle>
                          <IonCardSubtitle className='md:text-[0.7vw] text-[2.5vw] text-center'>{card.subtitle}</IonCardSubtitle>
                        </>
                      ) : (
                        <>
                          <IonSkeletonText animated className="skeleton-title" />
                          <IonSkeletonText animated className="skeleton-subtitle" />
                        </>
                      )}
                    </IonCardHeader>
                  </IonCard>
                </Link>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </>
  );
}

export default Content;
