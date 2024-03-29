import React, { useState, useEffect } from 'react';
import BackButton from './BackButton';
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
import { useParams } from 'react-router-dom';

interface CategoriesPageProps {
  loading: boolean;
  articles: any[]; // Adjust the type of 'articles' as needed
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ loading, articles }) => {
  const [skeletonLength, setSkeletonLength] = useState(10);
  const { categoryName } = useParams();
  useEffect(() => {
    // Fetch data for the specific category based on categoryName
    console.log('Fetching data for category:', categoryName);
  }, [categoryName]);
  useEffect(() => {
    if (articles.length > skeletonLength) {
      setSkeletonLength(articles.length);
    }
  }, [articles, skeletonLength]);

  return (
    <>
      <IonContent>
        <IonHeader>
          <BackButton />
        </IonHeader>


        <IonGrid>
          <IonRow>
            {loading || articles.length === 0 ? (
              <>
                {Array.from({ length: skeletonLength }).map((_, index) => (
                  <IonCol key={index} size="6" size-md="4" size-lg="2">
                    <IonCard className='ion-activatable recipe group hover:scale-95 ios hover:border-4 hover:border-blue-700'>
                      <IonSkeletonText animated style={{ width: '100%', height: '15vh' }} />
                      <IonCardHeader>
                        <IonSkeletonText animated style={{ width: '80%', height: '1.5rem', marginBottom: '0.5rem' }} />
                        <IonSkeletonText animated style={{ width: '90%', height: '1rem' }} />
                      </IonCardHeader>
                    </IonCard>
                  </IonCol>
                ))}
              </>
            ) : (
              articles.map(({ id, title, description, imageUrl }) => (
                <IonCol key={id} size="6" size-md="4" size-lg="2">
                  <IonCard className='ion-activatable recipe group hover:scale-95 ios'>
                    <>
                      <img alt={`Image for ${title}`} src={imageUrl} className='h-[15vh] w-[100%]' />
                      <IonCardHeader>
                        <IonCardTitle className='ion-text-wrap md:text-[1.1vw] text-[3vw] text-center truncate'>{title}</IonCardTitle>
                        <IonCardSubtitle className='ion-text-wrap md:text-[0.7vw] text-[2.5vw] text-center'>{description}</IonCardSubtitle>
                      </IonCardHeader>
                    </>
                  </IonCard>
                </IonCol>
              ))
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </>
  );
};

export default CategoriesPage;
