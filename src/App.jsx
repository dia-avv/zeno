import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Devices from "./pages/Devices";
import AddDevice from "./pages/AddDevice";
import Profiles from "./pages/Profile";
import Community from "./pages/Community";
import Navbar from "./components/NavBar";
import TopBar from "./components/TopBar";

function App() {
  return (
    <>
      <TopBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/devices/new" element={<AddDevice />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </>
  );
}

export default App;
