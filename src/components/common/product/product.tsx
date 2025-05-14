import { Swiper, SwiperSlide } from "swiper/react";
import { Product } from "../../../models/Product";
import "./product.scss";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaRegEye } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import ProductModal from "../modal/product/productModal";
import { TranslateService } from "../../../core/services/translateService";
import { useCartStore } from "../../../core/store/cartStore";
import { Alert } from "@material-ui/lab";
import { Snackbar } from "@material-ui/core";

interface ProductAllProps {
  products: Product[];
}
function ProductAll({ products }: ProductAllProps) {
  const [open, setOpen] = useState<boolean>(false);
  const addtocart = useCartStore((state) => state.addToCart);
  const [ statusAlert, setStatusAlert] = useState<boolean>(false)
  const cart = useCartStore((state) => state.cart);
  const [showAlert, setShowAlert] = useState(false);
  const handleShowModal = (id: string | number) => {
    navigate(`/home/${id}`);
    setOpen(true);
  };

  // const { cart, addToCart } = useCartStore();

  const screen = window.screen.width;
  console.log("screen : ", screen);

  const handleAddToCart = (product: Product) => {
    addtocart(product);
    const cartItem = [...cart].find((item) => item.id === product.id);
    if (cartItem) {
      setShowAlert(true);
      setStatusAlert(false);
      console.log("cart: ", cartItem);
    }
    else{
      setShowAlert(true);
      setStatusAlert(true)
    }
  };

  const navigate = useNavigate();
  const { translates, isLanguage } = useContext(TranslateService);
  console.log("translates : ", isLanguage);

  return (
    <div className="product">
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={screen > 1200 ? 4 : 2}
        navigation
        watchSlidesProgress={true}
        observer={true}
        observeParents={true}
        loop={true}
      >
        {products.length > 0 ? (
          <>
            {products.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="product__list" key={item.id}>
                  <div className="product__image">
                    <Link to={"/product/" + item.id}>
                      <img src={item.image} alt="productImage" />
                    </Link>
                  </div>
                  <div className="product__title">
                    <div className="name">{item.name}</div>
                    <div className="quantity">
                      {translates.Quantity}: {item.quantity}
                    </div>
                    <div className="product__price">
                      <div className="oldprice">
                        {isLanguage === "VI" ? item.price : item.price / 25000}{" "}
                        {translates.money}
                      </div>
                      <div className="newprice">
                        {isLanguage === "VI"
                          ? ((100 - item.discount) / 100) * item.price
                          : ((100 - item.discount) / 100 / 25000) * item.price}
                        {translates.money}
                      </div>
                    </div>
                    <button
                      style={{ cursor: "pointer" }}
                      className="btn-addtocart"
                      onClick={() => handleAddToCart(item)}
                    >
                      {translates.add_to_cart}
                    </button>
                  </div>
                  <div className="icon">
                    <div
                      className="icon1"
                      onClick={() => handleShowModal(item.id)}
                    >
                      <FaRegEye />
                    </div>
                    <div className="icon2">
                      <MdFavorite />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </>
        ) : (
          <>
            <p>Không tìm thấy sản phẩm</p>
          </>
        )}
      </Swiper>
      <ProductModal open={open} setOpen={setOpen} />
      {showAlert && (
        <Snackbar
          open={showAlert}
          autoHideDuration={6000}
          onClose={() => setShowAlert(false)}
          anchorOrigin={{ vertical: 'top', horizontal:'right' }}
        >
          <Alert severity={statusAlert ? 'success' : 'warning'} onClose={() => setShowAlert(false)}>
            Sản phẩm đã có trong giỏ hàng
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

export default ProductAll;
