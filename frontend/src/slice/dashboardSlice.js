import { createSlice } from "@reduxjs/toolkit"

const dashboardStore = {
    loading: false,
    loadingTransaction: false,
    summary: {},
    sales: {
        salesToday: 0,
        salesLastWeek: 0,
        salesLastMonth: 0
    },
    transactions: [],
    error: ''
}

const dasboardSlice = createSlice({
    name: 'dashboad',
    initialState: dashboardStore,
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
                summary: payload,
                loading: false
            }
        },
        fetchFail(state, { payload }) {
            return {
                ...state,
                loading: false,
                loadingTransaction: false,
                error: payload
            }
        },
        fetchSalesToday(state, { payload }) {
            return {
                ...state,
                loading: false,
                sales: {
                    ...state.sales,
                    salesToday: payload
                }
            }
        },
        fetchSalesLastWeek(state, { payload }) {
            return {
                ...state,
                loading: false,
                sales: {
                    ...state.sales,
                    salesLastWeek: payload
                }
            }
        },
        fetchSalesLastMonth(state, { payload }) {
            return {
                ...state,
                loading: false,
                sales: {
                    ...state.sales,
                    salesLastMonth: payload
                }
            }
        },
        fetchRequestTransactions(state) {
            return {
                ...state,
                loadingTransaction: true
            }
        },
        fetchSuccessTransactions(state, { payload }) {
            return {
                ...state,
                transactions: payload,
                loadingTransaction: false
            }
        },
    }
})

export const {
    fetchRequest,
    fetchSuccess,
    fetchFail,
    fetchSalesToday,
    fetchSalesLastWeek,
    fetchSalesLastMonth,
    fetchRequestTransactions,
    fetchSuccessTransactions
} = dasboardSlice.actions;
export const selectDashboard = (state) => state.dashboardStore;
export default dasboardSlice.reducer;