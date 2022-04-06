import { Amplify } from "aws-amplify"
import AwsConfig from "./aws-exports"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AWS from "aws-sdk"
// component imports
import Home from "./views/Home"
import AddOrUpdateBook from './views/AddOrUpdateBook';
import Login from './views/Login';
import Register from './views/Register';


Amplify.configure(AwsConfig)
AWS.config.update({region: process.env.REACT_APP_awsRegion});

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/book" element={<AddOrUpdateBook />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
