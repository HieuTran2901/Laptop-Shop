import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { publicRoutes } from "./routes";
import ToastNotification from "./components/Toast";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Routes>
            {publicRoutes.map((route, index) => {
              let Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}
          </Routes>
          <ToastNotification />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
