import React, { useState, useEffect, createRef } from 'react';
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

import Navbar from './Navbar';
import Girl from "../assets/images/girl.png.png"
import CategoryImage from "../assets/images/walt.svg"
import Samsung from "../assets/images/samsung.svg"
import Cisco from "../assets/images/cisco.svg";
import Ericsson from "../assets/images/ericsson.svg";
import { Link } from 'react-router-dom';

// Define the Category interface
interface Category {
  id: string;
  name: string;
}

interface Article {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const contentRef = createRef<HTMLIonContentElement>();
const scrollToBottom = () => {
  
  contentRef.current?.scrollToBottom(500);
  
};

interface ContentProps {
  loading: boolean;
  articles: Article[];
  categories: Category[];
  handleCategoryClick: (category: string) => void;
}

const Content: React.FC<ContentProps> = ({ loading, articles, categories, handleCategoryClick }) => {
  const [skeletonLength, setSkeletonLength] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    if (articles.length > skeletonLength) {
      setSkeletonLength(articles.length);
    }
  }, [articles]);

  // Function to handle category click
  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    handleCategoryClick(categoryName); // Assuming you have a function to handle category click
  };

  return (
    <>
      <IonHeader>
        <Navbar categories={categories} handleCategoryClick={handleCategorySelect} scrollToBottom={scrollToBottom} />
      </IonHeader>

      <IonContent className="ion-padding" ref={contentRef}>
        <div className='mt-[100px] p-[30px]  flex justify-between'>
          <div>
            <h1 className='font-bold text-6xl italic md:text-start text-center'>Skills <span className='text-blue-400'>that drive you forward</span></h1>
            <p className='italic mt-[30px] text-gray-500 font-bold md:text-start text-center'><span className='text-blue-400'>Tech Sea</span> Provides free of cost latest courses related for tech and <span className='text-blue-400'>computer Sciences !</span><br></br>Technology and the world of work change fast — with us, you’re faster. Get the skills to !</p>
            <div className='text-center md:text-start'>
              <IonButton className='w-full sm:w-auto ion-color ion-color-tertiary ios button button-solid ion-activatable ion-focusable mt-[30px] font-bold'><Link to={"/cat"}>See All the courses</Link></IonButton>
            </div>
            <div className='md:flex mt-[60px] md:block hidden'>
              <img src={CategoryImage} className='mr-[50px]' alt="Category" />
              <img src={Samsung} className='mr-[50px]' alt="Samsung" />
              <img src={Cisco} className='mr-[50px]' alt="Cisco" />
              <img src={Ericsson} className='mr-[50px]' alt="Ericsson" />
            </div>
          </div>
          <div style={{ marginTop: "-30px" }}>
            <img src={Girl} className='md:block hidden' alt="Girl" />
          </div>
        </div>
        <IonGrid style={{ marginTop: "10px" }}>
          <div className='p-[30px]'>
            <h1 className='font-bold text-4xl italic md:text-start text-center'>Our Latest <span className='text-blue-400'>{selectedCategory}</span> Courses</h1>
          </div>
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
                  <Link  to={`/blog/${id}`}>
                  <IonCard className='ion-activatable recipe group hover:scale-95 ios'>
                    <>
                      <img alt={`Image for ${title}`} src={imageUrl} className='h-[15vh] w-[100%]' />
                      <IonCardHeader>
                        <IonCardTitle className='md:text-[1.1vw] text-[3vw] text-center truncate'>{title}</IonCardTitle>
                        <IonCardSubtitle className='md:text-[0.7vw] text-[2.5vw] text-center'>{description}</IonCardSubtitle>
                      </IonCardHeader>
                    </>
                  </IonCard>
                  </Link>
                 
                </IonCol>
              ))
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </>
  );
};

export default Content;
