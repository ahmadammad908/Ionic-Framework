import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../Server/Firebase";
import Navbar from "./Navbar";
import { IonHeader } from "@ionic/react";

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

    const docRef = doc(db, "Articles", id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setArticle({ ...snapshot.data(), id: snapshot.id } as Article);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  return (
    <>
      <IonHeader>
        <Navbar />
      </IonHeader>
      <h1>Blog</h1>
      {article && (
        <div>
          <h2 style={{ color: "white", marginTop: '200px' }}>{article.title}</h2>
          {article.videoUrl && ( // Check if videoUrl is not null
            <video src={article.videoUrl} controls style={{ width: "300px" }}></video>
          )}
        </div>
      )}
    </>
  );
};

export default Blog;
