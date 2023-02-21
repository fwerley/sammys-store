import { createSlice } from "@reduxjs/toolkit"

const transactionStore = {
    transaction: {},
    loading: false,
    error: ''
}

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: transactionStore,
    reducers: {
        fetchTransaction(state) {
            return {
                ...state,
                loading: true
            }
        },
        successTransaction(state, { payload }) {
            return {
                ...state,
                transaction: payload,
                loading: false,
            }
        },
        fetchTransactionFail(state, { payload }) {
            return {
                ...state,
                transaction: {},
                error: payload,
                loading: false,
            }
        }
    }
})

export const { fetchTransaction, successTransaction, fetchTransactionFail } = transactionSlice.actions
export const selectTransaction = (state) => state.transactionStore
export default transactionSlice.reducer
