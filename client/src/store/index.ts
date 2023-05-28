import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import errorsSlice from './errorsSlice';
import projectsSlice from './projectsSlice';
import collectionsSlice from './collectionSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    errors: errorsSlice,
    projects: projectsSlice,
    collections: collectionsSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
