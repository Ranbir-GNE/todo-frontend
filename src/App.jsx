import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home";
import LoginRegister from "./Components/LoginRegister";
import { Toaster } from "sonner";
import Error from "./Components/Error";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Toaster
        {...{
          position: "top-right",
          duration: 5000,
        }}
      />
    </BrowserRouter>
  );
}

export default App;
