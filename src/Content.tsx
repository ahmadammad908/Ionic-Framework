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
  IonButton,
} from '@ionic/react';
import { collection, onSnapshot, query, QuerySnapshot } from 'firebase/firestore'; // Updated import
import { db } from '../src/Server/Firebase';
import Example from './Example';
import { Link } from 'react-router-dom';
import Girl from "../src/assets/images/girl.png.png"
import Category from "../src/assets/images/walt.svg"
import Samsung from "../src/assets/images/samsung.svg"
import Cisco from "../src/assets/images/cisco.svg";
import Ericsson from "../src/assets/images/ericsson.svg";

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
          videoUrl: doc.data().videoUrl, // Fetch videoUrl from Firestore

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

      <IonContent className="ion-padding">

        <div className='mt-[100px] p-[30px]  flex justify-between' >

          <div>
            <h1 className='font-bold text-6xl italic md:text-start text-center'  >Skills <span className='text-blue-400'>that drive you forward</span> </h1>


            <p className='italic mt-[30px] text-gray-500 font-bold md:text-start text-center'><span className='text-blue-400'>Tech Sea</span>  Provides free of cost latest courses related for tech and <span className='text-blue-400'>computer Sciences !</span><br></br>Technology and the world of work change fast — with us, you’re faster. Get the skills to  !</p>
            <div className='text-center md:text-start'>
              <IonButton className='class="w-full sm:w-auto ion-color ion-color-tertiary ios button button-solid ion-activatable ion-focusable" mt-[30px] font-bold ' >Learn Latest Courses 🧡</IonButton>
            </div>
            <div className='md:flex mt-[60px] md:block hidden'>
            <img src={Category} className='mr-[50px]'></img>
            <img src={Samsung} className='mr-[50px]'></img>
            <img src={Cisco} className='mr-[50px]'></img>
            <img src={Ericsson} className='mr-[50px]'></img>
            </div>
            
          </div>


         <div style={{ marginTop:"-30px"}}>
         <img src={Girl} className='md:block hidden' ></img>
         </div>


        </div>


        <IonGrid style={{ marginTop: "10px" }} >
          <div className=' p-[30px]'>
            <h1 className='font-bold text-4xl italic md:text-start text-center'>Our Latest <span className='text-blue-400'>Courses</span></h1>
          </div>
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
              articles.map(({ id, title, description, imageUrl }) => (
                <>
                  <IonCol key={id} size="6" size-md="4" size-lg="2">
                    <Link to={`/blog/${id}`}>
                      <IonCard className='ion-activatable recipe group hover:scale-95 ios '>
                        <>
                          <img alt={`Image for ${title}`} src={imageUrl} className='h-[15vh] w-[100%]' />
                          <IonCardHeader>
                            <IonCardTitle className='md:text-[1.1vw] text-[3vw] text-center'>{title}</IonCardTitle>
                            <IonCardSubtitle className='md:text-[0.7vw] text-[2.5vw] text-center'>{description}</IonCardSubtitle>
                          </IonCardHeader>
                        </>
                      </IonCard>
                    </Link>
                  </IonCol>
                  {/* <video src={videoUrl} controls style={{width:"200PX"}}></video> */}

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
