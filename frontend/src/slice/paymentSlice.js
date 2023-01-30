import { createSlice } from "@reduxjs/toolkit";

const paymentState = {
    successPay: false,
    loadingPay: false,
    errorPay: ''
}

const paymentSlice = createSlice({
    name: 'payment',
    initialState: paymentState,
    reducers: {
        paymentRequest(state) {
            return {
                ...state,
                loadingPay: true
            }
        },
        paymentSuccess(state) {
            return {
                ...state,
                loadingPay: false,
                successPay: true
            }
        },
        paymentFail(state, { payload }) {
            return {
                ...state,
                loadingPay: false,
                successPay: false,
                errorPay: payload
            }
        },
        paymentReset(state, { payload }) {
            return {
                ...state,
                loadingPay: false,
                successPay: false,
                errorPay: ''
            }
        }
    }
});

export const {
    paymentRequest, paymentSuccess, paymentFail, paymentReset
} = paymentSlice.actions;
export const selectPayment = (state) => state.paymentStore;
export default paymentSlice.reducer;