// import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// interface Category {
//     id: string;
//     name: string;
//     // Add more fields as needed
//   }
  
//   interface CategoriesState {
//     categories: Category[];
//     status: string;
//   }
  
//   const initialState: CategoriesState = {
//     categories: [],
//     status: "loading",
//   };
  
//   const categoriesSlice = createSlice({
//     name: "categories",
//     initialState,
//     reducers: {
//       setCategories: (state, action: PayloadAction<Category[]>) => {
//         state.categories = action.payload;
//         state.status = "idle";
//       },
//     },
//   });
  
//   export default categoriesSlice.reducer;
//   export const { setCategories } = categoriesSlice.actions;