import DashboardPage from "containers/DashboardPage";

import HomePage from "containers/HomePage";
import LoginPage from "containers/LoginPage";
import RegisterPage from "containers/RegisterPage";
import EditUser from "containers/EditUser";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import { useEffect } from "react";
import { checkAuth } from "features/user";

const App = () =>{
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(checkAuth())
  }, []);

  return(
      <Router>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/dashboard' element={<DashboardPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/editUser' element={<EditUser/>}/>
        </Routes>
      </Router>
  )

}

export default App;
