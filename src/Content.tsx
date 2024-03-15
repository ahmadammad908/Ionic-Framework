// Content.tsx
import React, { useState, useEffect } from 'react';
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
import { collection, onSnapshot, query, QuerySnapshot } from 'firebase/firestore'; // Updated import
import { db } from '../src/Server/Firebase';
import Example from './Example';

interface Article {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const Content: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [skeletonLength, setSkeletonLength] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const articleRef = collection(db, 'Articles');
      const q = query(articleRef);

      const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
        const updatedArticles: Article[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          imageUrl: doc.data().imageUrl,
        }));
        setArticles(updatedArticles);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (articles.length > skeletonLength) {
      setSkeletonLength(articles.length);
    }
  }, [articles]);

  useEffect(() => {
    console.log("Loading state:", loading); // Add console log to check loading state
  }, [loading]); // Run this effect whenever loading state changes

  return (
    <>
      <IonHeader>
        <Example />
        {/* Header content here */}
      </IonHeader>
      
      <IonContent>
    
        <IonGrid style={{ marginTop: "100px" }}>
          <IonRow>
            {loading || articles.length === 0 ? (
              <>
              {
                Array.from({ length: skeletonLength }).map((_, index) => (
                  <IonCol key={index} size="6" size-md="4" size-lg="2">
                    <IonCard className='ion-activatable recipe group hover:scale-95 ios hover:border-4 hover:border-blue-700'>
                      <IonSkeletonText animated style={{ width: '100%', height: '15vh' }} />
                      <IonCardHeader>
                        <IonSkeletonText animated style={{ width: '80%', height: '1.5rem', marginBottom: '0.5rem' }} />
                        <IonSkeletonText animated style={{ width: '90%', height: '1rem' }} />
                      </IonCardHeader>
                    </IonCard>
                  </IonCol>
                ))
              }
               
              </>
            ) : (
              articles.map(({ id, title, description, imageUrl,videoUrl}) => (
                <>
                <IonCol key={id} size="6" size-md="4" size-lg="2">
                  <IonCard className='ion-activatable recipe group hover:scale-95 ios hover:border-4 hover:border-blue-700'>
                    <>
                      <img alt={`Image for ${title}`} src={imageUrl} className='h-[15vh] w-[100%]' />
                      <IonCardHeader>
                        <IonCardTitle className='md:text-[1.1vw] text-[3vw] text-center'>{title}</IonCardTitle>
                        <IonCardSubtitle className='md:text-[0.7vw] text-[2.5vw] text-center'>{description}</IonCardSubtitle>
                      </IonCardHeader>
                    </>
                  </IonCard>
                </IonCol>

                </>

                
              ))
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </>
  );
};

export default Content;
