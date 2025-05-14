import { Grid } from "@material-ui/core";
import { useCartStore } from "../../../core/store/cartStore";
import { Product } from "../../../models/Product";
import { Link } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { useContext } from "react";
import { TranslateService } from "../../../core/services/translateService";
import "./productShop.scss";
import { Pagination } from "@material-ui/lab";
interface productShop {
  products: Product[];  
}

function ProductShop({ products }: productShop) {
  const { translates, isLanguage } = useContext(TranslateService);
  const cart = useCartStore((state) => state.cart);
  console.log("products: ", products);

  const handleAddToCart = (item) => {
    if (cart.some((itemcart) => itemcart.id === item.id)) {
      message.warning(`${item.name} đã có trong giỏ hàng`);
      return;
    }
    dispatch(addToCart(item.id, 1, item));
    message.success(`${item.name} đã được thêm vào giỏ hàng thành công`);
  };
  return (
    <>
      <div className="product">
        <Grid container spacing={6}>
          {products ? (
            <>
              {products.map((item) => (
                <Grid item xl={4} lg={4} md={6} sm={6} xs={6}>
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
                          {isLanguage === "VI"
                            ? item.price
                            : item.price / 25000}{" "}
                          {translates.money}
                        </div>
                        <div className="newprice">
                          {isLanguage === "VI"
                            ? ((100 - item.discount) / 100) * item.price
                            : ((100 - item.discount) / 100 / 25000) *
                              item.price}
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
                        // onClick={() => handleShowModal(item.id)}
                      >
                        <FaRegEye />
                      </div>
                      <div className="icon2">
                        <MdFavorite />
                      </div>
                    </div>
                  </div>
                </Grid>
              ))}
            </>
          ) : (
            <p>Không tìm thấy sản phẩm nào thỏa mãn</p>
          )}
        </Grid>
        <div className='paginator'>
          <Pagination count={10} color="secondary" />
        </div>
      </div>
    </>
  );
}

export default ProductShop;
