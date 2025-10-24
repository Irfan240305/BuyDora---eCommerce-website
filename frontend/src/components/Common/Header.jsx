import Topbar from "../Layout/Topbar";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      {/* Topbar */}
      <Topbar />
      {/* Navbar */}
      <Navbar/>
      {/* Cart Drawer */}



    </header>
  )
}

export default Header