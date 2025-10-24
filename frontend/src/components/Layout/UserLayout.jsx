import { Outlet } from "react-router-dom";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
const UserLayout = () => {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      < Footer/>
    </>
  );
};

export default UserLayout;
