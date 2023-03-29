import { createSlice } from "@reduxjs/toolkit";

const sellerStore = {
    seller: {},
    loading: false,
    products: [],
    loadingProducts: false,
    error: ''
}

const sellerSlice = createSlice({
    name: 'seller',
    initialState: sellerStore,
    reducers: {
        fetchProducts(state) {
            return {
                ...state,
                loadingProducts: true
            }
        },
        fetchProductsSuccess(state, { payload }) {
            return {
                ...state,
                products: payload,
                loadingProducts: false
            }
        },
        fetchProductsFail(state, { payload }) {
            return {
                ...state,
                loadingProducts: false,
                error: payload
            }
        },
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

export const { 
    fetchProducts,
    fetchProductsSuccess,
    fetchProductsFail,
    sellerFetch, 
    sellerFetchSuccess, 
    sellerFetchFail 
} = sellerSlice.actions;
export const selectSeller = (state) => state.sellerStore;
export default sellerSlice.reducer;