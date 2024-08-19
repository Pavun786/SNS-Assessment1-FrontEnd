import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from '../features/expence/expenceSlice';

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
  },
});
