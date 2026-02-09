// import ProductList from "../components/ProductList";
import AdminPage from "../pages/Admin";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DetailProducts from "../pages/DetailProduct";

const publicRoutes = [
  { path: "/", component: Home },
  { path: "/admin", component: AdminPage },
  // { path: "/home", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/detail-product/:id", component: DetailProducts },
];

const privateRoutes = [
  // Add private routes here if needed in the future
];

export { publicRoutes, privateRoutes };
