import Header from "../components/Header";
import Banner from "../components/Banner";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";
import FeaturedProductList from "../components/FeaturedProductList";

function Home() {
  return (
    <>
      <Header />
      <Banner />
      <div className="container my-5">
        <FeaturedProductList />
        <ProductList />
      </div>
      <Footer />
    </>
  );
}

export default Home;
