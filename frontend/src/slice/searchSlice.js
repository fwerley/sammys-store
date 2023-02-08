import { createSlice } from "@reduxjs/toolkit"

const searchStore = {
    loading: false,
    error: '',
    countProducts: 0,
    products: [],
    page: 0,
    pages: 0,
}

const searchSlice = createSlice({
    name: 'search',
    initialState: searchStore,
    reducers: {
        fetchRequest(state) {
            return {
                ...state,
                loading: true
            }
        },
        fetchSuccess(state, { payload }) {
            return {
                ...state,
                products: payload.products,
                page: payload.page,
                countProducts: payload.countProducts,
                pages: payload.pages,               
                loading: false,
            }
        },
        fetchFail(state, { paylod }) {
            return {
                ...state,
                loading: false,
                error: paylod
            }
        }
    }
})

export const { fetchRequest, fetchSuccess, fetchFail } = searchSlice.actions;
export const selectSearch = (state) => state.searchStore;
export default searchSlice.reducer;