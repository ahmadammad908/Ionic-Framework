import { useState, useEffect } from 'react'
import BackButton from './BackButton'
import { motion } from 'framer-motion';

// import { IonContent, IonHeader } from '@ionic/react'
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


interface Article {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
}
interface ContentProps {
    loading: boolean;
    articles: Article[];
}const CategoriesPage: React.FC<ContentProps> = ({ loading, articles }) => {

    const [skeletonLength, setSkeletonLength] = useState(10);

    useEffect(() => {
        if (articles.length > skeletonLength) {
            setSkeletonLength(articles.length);
        }
    }, [articles]);
    return (
        <>
            <IonContent>
                <IonHeader>
                    <BackButton />
                </IonHeader>


                <IonGrid style={{ marginTop: "10px" }}>
                    <div className='p-[30px]'>
                        <motion.h1 initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}>
                            <h1 className='font-bold text-4xl italic md:text-start text-center'>Our Latest <span className='text-blue-400'>Courses</span></h1>
                        </motion.h1>
                    </div>
                    <IonRow>
                        {loading || articles.length === 0 ? (
                            <>
                                {Array.from({ length: skeletonLength }).map((_, index) => (
                                    <IonCol key={index} size="6" size-md="4" size-lg="2">
                                        <motion.div initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}>
                                            <IonCard className='ion-activatable recipe group hover:scale-95 ios hover:border-4 hover:border-blue-700'>
                                                <IonSkeletonText animated style={{ width: '100%', height: '15vh' }} />
                                                <IonCardHeader>
                                                    <IonSkeletonText animated style={{ width: '80%', height: '1.5rem', marginBottom: '0.5rem' }} />
                                                    <IonSkeletonText animated style={{ width: '90%', height: '1rem' }} />
                                                </IonCardHeader>
                                            </IonCard>
                                        </motion.div>


                                    </IonCol>
                                ))}
                            </>
                        ) : (
                            articles.map(({ id, title, description, imageUrl }) => (
                                <IonCol key={id} size="6" size-md="4" size-lg="2">
                                    <Link to={`/blog/${id}`}>
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
    )
}

export default CategoriesPage