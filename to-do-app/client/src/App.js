import './App.css';
import Login from './pages/LoginPage';
import Registration from './pages/RegistrationPage';
import ToDo from './pages/ToDoListPage';
import Welcome from './pages/WelcomePage';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Welcome/>}></Route>
          <Route path='/registration' element={<Registration/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/to-do' element={<ToDo/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
