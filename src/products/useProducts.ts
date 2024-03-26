import { collection, getDocs, query, where } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { db } from "../Server/Firebase";
import { setProducts, setLoading } from "../products/productsSlice";
import { setCategories } from "../products/categoriesSlice";

type Product = {
  id: string;
  // Define other properties based on your product structure
};

type Category = {
  // Define properties for your category
};

export default function useProducts() {
  const dispatch = useDispatch();

  async function getProducts({ category }: { category: string | null }) {
    try {
      dispatch(setLoading(true)); // Set loading to true before fetching products

      const productsRef = collection(db, "products");
      const productsByCatRef = query(
        productsRef,
        where("category", "==", category)
      );

      const querySnapshot = await getDocs(
        category ? productsByCatRef : productsRef
      );

      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...(doc.data() as Product),
        });
        console.log(doc.id, " => ", doc.data());
      });

      dispatch(
        setProducts({
          products,
          state: "loaded",
        })
      );
    } catch (error) {
      dispatch(
        setProducts({
          products: [],
          state: "failed",
        })
      );
    } finally {
      dispatch(setLoading(false)); // Set loading to false after fetching products (success or error)
    }
  }

  async function getCategories() {
    try {
      const q = collection(db, "categories");

      const querySnapshot = await getDocs(q);
      const categories: Category[] = [];

      querySnapshot.forEach((doc) => {
        categories.push(doc.data() as Category);
        console.log(doc.id, " => ", doc.data());
      });

      dispatch(
        setCategories({
          categories,
          state: "loaded",
        })
      );
    } catch (error) {
      dispatch(
        setCategories({
          categories: [],
          state: "failed",
        })
      );
    }
  }

  return { getProducts, getCategories };
}
