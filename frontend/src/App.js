import './App.css';
import './components/cloudHeader/CloudHeader.css';
import './components/cloudBody/CloudBody.css';
import './components/headerMenu/HeaderMenu.css';
import './components/uploadFileForm/UploadFileForm.css';
import './components/shareWindow/ShareWindow.css';
import './components/adminPanel/AdminPanel.css';
import './components/userFilesAdminPopup/UserFilesAdminPopup.css';
import './components/registerForm/RegisterForm.css';
import './components/loginForm/LoginForm.css';

import RegisterForm from './components/registerForm/RegisterForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/homepage/HomePage';
import CloudHeader from './components/cloudHeader/CloudHeader';
import CloudBody from './components/cloudBody/CloudBody';
import { useSelector } from "react-redux";

function App() {
  const storageUserData = JSON.parse(localStorage.getItem('userData'));
  const userAuthState = useSelector((state) => state.user.userAuthenticated);
  return (
    <div className="App">
      <BrowserRouter>
      {storageUserData ? storageUserData.user.userAuthenticated ? <CloudHeader></CloudHeader> : null : userAuthState ? <CloudHeader></CloudHeader> : null}
      <Routes>
        <Route path={'/'} element={<HomePage />} />  
        <Route path='/store' element={<CloudBody />} />
        <Route path='/register' element={<RegisterForm />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
