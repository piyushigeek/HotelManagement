import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: {},
        OrderList: []
    },
    reducers: {
        setUser: (state, value) => {
            state.user = value;
        },
        setOrderList: (state, order) => {
            state.OrderList = [...state.OrderList, order.payload];
        },
        updatedOrderList : (state, action) => {
            // Assuming action.payload is the updated OrderList array
            state.OrderList = action.payload;
        }
    },
});

export const { setUser, setOrderList, updatedOrderList } = authSlice.actions;
export default authSlice.reducer