import { createSlice } from '@reduxjs/toolkit'

const initialState = { 
    userData: undefined,
    userAuthenticated: false,
    userFiels: [],
    adminViewFiles: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        authenticateUser(state, action) {
            state.userAuthenticated = true;
        },
        logoutUser(state, action) {
            state.userAuthenticated = false;
            state.userFiels = [];
        },
        saveUserData(state, action) {
            state.userData = action.payload;
        },
        addUserFiles(state, action) {
            state.userFiels = [...state.userFiels, JSON.parse(action.payload)]
        },
        replaceUserFiles(state, action) {
            state.userFiels = [...JSON.parse(action.payload)] 
        },
        removeUserFile(state, action) {
            state.userFiels = state.userFiels.filter((item) => item.file_uid !== action.payload);
        },
        updateDownloadFile(state, action) {
            const data =  JSON.parse(action.payload)
            state.userFiels = [...state.userFiels.map((item) => {
                if (item.id ===data.id) {
                    item.file_last_download_time = data.file_last_download_time
                }
                return item
            })];
        },
        renameUserFile(state, action) {
            const data = JSON.parse(action.payload);
            state.userFiels = state.userFiels = Array.from(state.userFiels).map((item) => {
                if (Number(item.id) === Number(data.id)) {
                    return {
                        ...item,
                        file_name: data.file_name,
                        file_comment: data.file_comment,
                    }
                }
                return item
            });
        },
        adminViewUserFiles(state, action) {
            state.adminViewFiles = action.payload
        },

    }
});


export const {  
    authenticateUser, 
    logoutUser, 
    saveUserData, 
    addUserFiles, 
    replaceUserFiles, 
    removeUserFile, 
    renameUserFile, 
    updateDownloadFile 
} = userSlice.actions;
export default userSlice.reducer;