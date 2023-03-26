import { createSlice } from "@reduxjs/toolkit";

const sellerStore = {
    seller: {},
    loading: false,
    error: ''
}

const sellerSlice = createSlice({
    name: 'seller',
    initialState: sellerStore,
    reducers: {
        sellerFetch(state) {
            return {
                ...state,
                loading: true
            }
        },
        sellerFetchSuccess(state, { payload }) {
            return {
                ...state,
                loading: false,
                seller: payload
            }
        },
        sellerFetchFail(state, { payload }) {
            return {
                ...state,
                error: payload
            }
        }
    }
})

export const { sellerFetch, sellerFetchSuccess, sellerFetchFail } = sellerSlice.actions;
export const selectSeller = (state) => state.sellerStore;
export default sellerSlice.reducer;