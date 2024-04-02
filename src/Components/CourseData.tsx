import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../Server/Firebase";
import { IonContent, IonHeader } from "@ionic/react";
import BackButton from "./BackButton";

interface Article {
  id: string;
  title: string;
  content: string;
  course: string;
  videoUrl: string | null;
  posterUrl: string | null;
  createdAt: { seconds: number; nanoseconds: number };
  paragraph: string
  Outline: string

}

const DEFAULT_POSTER_URL = "https://example.com/default-poster.jpg";

const Blog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    // Check if id exists, if not, return early
    if (!id) {
      return;
    }

    const docRef = doc(db, "products", id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setArticle({ ...snapshot.data(), id: snapshot.id } as Article);
      } else {
        console.log('Document does not exist!');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const formatDate = (date: Date): string => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const year = date.getFullYear();


    return `${day}, ${month} ${date.getDate()}, ${year}`;
  };

  return (
    <>
      <IonContent>
        <IonHeader>
          <BackButton />
        </IonHeader>
        <div className="mt-[70px]">
          {article && (
            <>
              
              <div className="p-[10px] md:pl-[100px] text-center md:text-start">
                <span className="badge text-white bg-amber-500 font-bold p-[10px] rounded"> Thoughts </span>
              </div>

              <div className="p-[10px] md:pl-[100px] text-center md:text-start">
                <h1 className="text-4xl lg:text-5xl font-bold lg:tracking-tight mt-1 lg:leading-tight font-myCustomCursive " id="family">{article.Outline}</h1>
              </div>
              <div className="p-[10px] md:pl-[100px] text-start   flex flex-wrap ">
                {article.createdAt && (
                  <p className="text-gray-400 font-bold ml-[30px] md:ml-[0px]" id="family"> {formatDate(new Date(article.createdAt.seconds * 1000))}</p>
                )}

                <div className="w-full md:w-auto flex flex-wrap gap-3 mt-[20px] md:mt-[0px] " >
                  <span className="badge badge-sm bg-pink-200 text-pink-800 ml-[30px] p-[3px]  rounded">
                    #interviews
                  </span>
                  <span className="badge badge-sm bg-pink-200 text-pink-800 ml-[30px]  p-[3px]  rounded">
                    #recruiters
                  </span>
                  <span className="badge badge-sm bg-pink-200 text-pink-800 ml-[30px]  p-[3px]  rounded">
                    #coding-challenges
                  </span>
                  <span className="badge badge-sm bg-pink-200 text-pink-800 ml-[20px]  p-[3px] rounded">
                    #programming
                  </span>

                </div>
              </div>
              <div className="mt-[30px] p-[10px] md:pl-[100px]  prose prose-lg mt-6 max-w-7xl pl-[40px] ">
                <p className="font-bold text-gray-500" id="family">{article.paragraph}</p>
              </div>
              <div className="mt-[30px] p-[10px] md:pl-[100px] ">
                {article.videoUrl && (
                  <video src={article.videoUrl} controls style={{ width: "1000px", }} poster={article.posterUrl || DEFAULT_POSTER_URL}></video>
                )}
              </div>
              <div className="p-[10px] md:pl-[100px]  text-start pl-[32px]">
                <h1 className="text-4xl lg:text-5xl font-bold lg:tracking-tight mt-1 lg:leading-tight font-myCustomCursive " id="family" >Course Outline</h1>
              </div>
              <div className="mt-[0px] p-[10px] md:pl-[100px]  prose prose-lg mt-6 max-w-7xl pl-[40px] ">
                <p className="font-bold text-gray-500" id="family">{article.course}</p>
              </div>
            </>
          )}
        </div>
      </IonContent>
    </>
  );
};

export default Blog;
