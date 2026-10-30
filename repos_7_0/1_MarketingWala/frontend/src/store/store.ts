// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formslice'; // Import your form slice

const store = configureStore({
  reducer: {
    form: formReducer, // Add your form slice to the Redux store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
