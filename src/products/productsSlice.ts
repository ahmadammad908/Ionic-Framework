// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface Product {
//   id: string;
//   title: string;
//   description: string;
//   imageUrl: string;
// }

// interface ProductsState {
//   products: Product[];
//   loading: boolean;
// }

// const initialState: ProductsState = {
//   products: [],
//   loading: false,
// };

// const productsSlice = createSlice({
//   name: "products",
//   initialState,
//   reducers: {
//     setProducts: (state, action: PayloadAction<{ products: Product[]; state: string }>) => {
//       state.products = action.payload.products;
//       state.loading = action.payload.state === "loading";
//     },
//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.loading = action.payload;
//     },
//   },
// });

// export const { setProducts, setLoading } = productsSlice.actions;
// export default productsSlice.reducer;
