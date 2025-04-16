import { Routes , Route } from "react-router-dom";
import RegisterPage from "./Credentials/RegisterPage";
import LoginPage from "./Credentials/LoginPage";
import MlaElection from "./features/MlaElection";
import MpElection from "./features/MpElection";
import Layout from "./Layout";
import FutureElection from "./features/FutureElection";
import Dashboard from "./features/Dashboard";


function App() {
  return (
    <Layout>
      <Routes>
          <Route path="/" element={<RegisterPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/mla/election" element={<MlaElection/>} />
          <Route path="/mp/election" element={<MpElection/>} />
          <Route path="/future/election" element={<FutureElection/>} />
      </Routes>
    </Layout>
  );
}

export default App;
