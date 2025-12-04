import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  budget: 5000,
  transactions: [],
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    setBudget: (state, action) => {
      state.budget = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
    resetBudget: (state) => {
      state.budget = 5000;
      state.transactions = [];
    },
  },
});

export const { setBudget, addTransaction, resetBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
