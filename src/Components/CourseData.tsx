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
  videoUrl: string | null;
}

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

  return (
    <>
      <IonContent>
        <IonHeader>
          <BackButton />
        </IonHeader>
        {article && (
          <div>
            <h2 style={{ marginTop: '200px' }}>{article.title}</h2>
            {article.videoUrl && (
              <video src={article.videoUrl} controls style={{ width: "300px" }}></video>
            )}
            <p>{article.content}</p>
          </div>
        )}
      </IonContent>
    </>
  );
};

export default Blog;
