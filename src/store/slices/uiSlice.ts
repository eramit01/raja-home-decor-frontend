import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    isLoginModalOpen: boolean;
    loginRedirectUrl: string | null;
    pendingAction: 'CART' | 'WISHLIST' | 'CHECKOUT' | null;
    pendingActionData: any | null;
}

const initialState: UiState = {
    isLoginModalOpen: false,
    loginRedirectUrl: null,
    pendingAction: null,
    pendingActionData: null
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openLoginModal: (state, action: PayloadAction<{ redirectUrl?: string; pendingAction?: 'CART' | 'WISHLIST' | 'CHECKOUT'; pendingActionData?: any } | undefined>) => {
            state.isLoginModalOpen = true;
            if (action.payload) {
                state.loginRedirectUrl = action.payload.redirectUrl || null;
                state.pendingAction = action.payload.pendingAction || null;
                state.pendingActionData = action.payload.pendingActionData || null;
            }
        },
        closeLoginModal: (state) => {
            state.isLoginModalOpen = false;
            // We don't clear pending actions immediately to allow processing after successful login
        },
        clearPendingActions: (state) => {
            state.loginRedirectUrl = null;
            state.pendingAction = null;
            state.pendingActionData = null;
        }
    },
});

export const { openLoginModal, closeLoginModal, clearPendingActions } = uiSlice.actions;
export default uiSlice.reducer;
