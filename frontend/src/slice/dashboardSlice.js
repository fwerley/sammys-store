import { createSlice } from "@reduxjs/toolkit"


const dashboardStore = {
    loading: false,
    summary: {},
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
                error: payload
            }
        }
    }
})

export const { fetchRequest, fetchSuccess, fetchFail } = dasboardSlice.actions;
export const selectDashboard = (state) => state.dashboardStore;
export default dasboardSlice.reducer;