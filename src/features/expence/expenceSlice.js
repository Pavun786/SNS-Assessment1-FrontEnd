import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../Global.js';

// Async thunks for CRUD operations
export const fetchExpenses = createAsyncThunk(
    'expenses/fetchExpenses',
    async () => {
        const response = await fetch(`${API}/expence/getAllExpence`);
        return await response.json();
    }
);

export const fetchCategories = createAsyncThunk(
    'expenses/fetchCategories',
    async () => {
        const response = await fetch(`${API}/category/getAllCategory`);
        return await response.json();
    }
);

export const fetchExpenseById = createAsyncThunk(
    'expenses/fetchExpenseById',
    async (id) => {
        const response = await fetch(`${API}/expence/${id}`);
        const data = await response.json();
        return data;
    }
);

export const addExpense = createAsyncThunk(
    'expenses/addExpense',
    async (newExpense) => {
        const response = await fetch(`${API}/expence/createExpence`, {
            method: 'POST',
            body: JSON.stringify(newExpense),
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    }
);

export const updateExpense = createAsyncThunk(
    'expenses/updateExpense',
    async ({ id, updatedExpense }) => {
        const response = await fetch(`${API}/expence/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedExpense),
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    }
);

export const deleteExpense = createAsyncThunk(
    'expenses/deleteExpense',
    async (id) => {
        const response = await fetch(`${API}/expence/${id}`, {
            method: 'DELETE',
        });
        return { id, ...(await response.json()) };
    }
);

const expenseSlice = createSlice({
    name: 'expenses',
    initialState: {
        expenses: [],
        categories: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.expenses = action.payload;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addExpense.fulfilled, (state, action) => {
                state.expenses.push(action.payload);
            })
            .addCase(fetchExpenseById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchExpenseById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.expense = action.payload;
            })
            .addCase(fetchExpenseById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                const index = state.expenses.findIndex(expense => expense._id === action.payload._id);
                state.expenses[index] = action.payload;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.expenses = state.expenses.filter(expense => expense._id !== action.payload.id);
            });
    },
});

export const selectCategories = (state) => state.expenses.categories;

export default expenseSlice.reducer;



