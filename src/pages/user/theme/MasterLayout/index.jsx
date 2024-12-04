import { Outlet } from "react-router-dom";
import Header from "../header";
import Footer from "../footer";
import { UserProvider } from "../../../../middleware/UserContext";
import { CartProvider } from "../../../../middleware/CartContext";

const MasterLayout = (props) => {
  return (
    <UserProvider>
      <CartProvider>
        <div {...props}>
          <Header />
          <Outlet />
          <Footer />
        </div>
      </CartProvider>
    </UserProvider>
  );
};

export default MasterLayout;
