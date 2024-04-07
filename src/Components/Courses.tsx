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
import { motion } from 'framer-motion';


import Navbar from './Navbar';
import CategoryImage from "../assets/images/walt.svg"
import Samsung from "../assets/images/samsung.svg"
import Cisco from "../assets/images/cisco.svg";
import Ericsson from "../assets/images/ericsson.svg";
import { Link } from 'react-router-dom';
import techsea from "../assets/images/techsea.png"

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

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    // Retrieve selected category from localStorage
    const savedCategory = localStorage.getItem('selectedCategory');
    return savedCategory || ''; // If no category is found, default to empty string
  });
  const [visibleArticles, setVisibleArticles] = useState(6); // Initial number of visible articles

  useEffect(() => {
    if (articles.length > skeletonLength) {
      setSkeletonLength(articles.length);
    }
  }, [articles]);

  // Function to handle category click
  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    handleCategoryClick(categoryName); // Assuming you have a function to handle category click

    // Save selected category to localStorage
    localStorage.setItem('selectedCategory', categoryName);
  };

  // Function to load more articles
  const loadMoreArticles = () => {
    setVisibleArticles(prev => prev + 6); // Load 6 more articles
  };

  return (
    <>
      <IonHeader>
        <Navbar categories={categories} handleCategoryClick={handleCategorySelect} scrollToBottom={scrollToBottom} />
      </IonHeader>

      <IonContent className="ion-padding" ref={contentRef}>
        <div className='mt-[100px] p-[30px]  flex justify-between'>
          <div>
            <motion.h1 initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className='font-bold text-6xl italic md:text-start text-center'>Skills that<span className='text-blue-400'> drive you forward</span></h1>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}>
              <p className='italic mt-[30px] text-gray-500 font-bold md:text-start text-center'><span className='text-blue-400'>Tech Sea</span> Provides free of cost latest courses related for tech and <span className='text-blue-400'>computer Sciences !</span><br></br>Technology and the world of work change fast — with us, you’re faster. Get the skills to !</p>
            </motion.p >
            <div className='text-center md:text-start'>
              <motion.button initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}>
                <IonButton className='w-full sm:w-auto ion-color ion-color-tertiary ios button button-solid ion-activatable ion-focusable mt-[30px] font-bold'><Link to={"/cat"}>See All the courses</Link></IonButton>
              </motion.button>
            </div>
            <div className='md:flex mt-[60px] md:block hidden'>
              <motion.img src={CategoryImage} className='mr-[50px]' alt="Category" initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }} >

              </motion.img>
              <motion.img src={Samsung} className='mr-[50px]' alt="Category"initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }} >

              </motion.img>
              <motion.img src={Cisco} className='mr-[50px]' alt="Category"initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }} >

              </motion.img>
              <motion.img src={Ericsson} className='mr-[50px]' alt="Category" initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }} >

              </motion.img>

            </div>
          </div>
          <div style={{ marginTop: "-30px" }}>
            <motion.img initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }} src={techsea} className='md:block hidden' style={{ width: "100%" }}>
            </motion.img>
          </div>
        </div>
        <IonGrid style={{ marginTop: "10px" }}>
          <div className='p-[30px]'>
            <motion.h1 initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}>
            <h1 className='font-bold text-4xl italic md:text-start text-center'><span className='text-blue-400'>    {selectedCategory ? `${selectedCategory}` : 'Our Latest Courses'}
            </span></h1>
            </motion.h1>
          </div>
          <IonRow>
            {loading || articles.length === 0 ? (
              <>
                {Array.from({ length: visibleArticles }).map((_, index) => (
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
              articles.slice(0, visibleArticles).map(({ id, title, description, imageUrl }) => (
                <IonCol key={id} size="6" size-md="4" size-lg="2">
                  <Link to={`/blog/${id}`}>
                    <motion.div initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}>
                    <IonCard className='ion-activatable recipe group hover:scale-95 ios'>
                      <>
                        <img alt={`Image for ${title}`} src={imageUrl} className='h-[15vh] w-[100%]' />
                        <IonCardHeader>
                          <IonCardTitle className='md:text-[1.1vw] text-[3vw] text-center truncate'>{title}</IonCardTitle>
                          <IonCardSubtitle className='md:text-[0.7vw] text-[2.5vw] text-center'>{description}</IonCardSubtitle>
                        </IonCardHeader>
                      </>
                    </IonCard>
                    </motion.div>
                    
                  </Link>

                </IonCol>
              ))
            )}
          </IonRow>
          {!loading && articles.length > visibleArticles && (
            <div className="ion-text-center ion-margin">
              <IonButton onClick={loadMoreArticles}>Load More</IonButton>
            </div>
          )}
        </IonGrid>
      </IonContent>
    </>
  );
};

export default Content;
