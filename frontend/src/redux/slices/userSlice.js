import { createSlice } from '@reduxjs/toolkit'

const initialState = { 
    userData: undefined,
    userAuthenticated: false,
    userFiels: [],
    adminViewFiles: [],
    authUsers: [],
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
        addAuthUser(state, action) {
            state.authUsers = [...state.authUsers, action.payload]
        },
        removeAuthUser(state, action) {
            state.authUsers = [...state.authUsers.filter((item) => item.userId !== action.payload)]
        },
        getAuthUser(state, payload) {
            return state.authUsers.find((item) => item.userId === payload);
        }

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
    updateDownloadFile,
    addAuthUser,
    removeAuthUser,
    getAuthUser,
} = userSlice.actions;
export default userSlice.reducer;