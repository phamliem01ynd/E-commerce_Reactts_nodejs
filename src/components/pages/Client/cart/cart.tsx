import React, { useContext, useEffect, useRef, useState } from "react";
import "./cart.scss";
import { TranslateService } from "../../../../core/services/translateService";
import { MdDelete } from "react-icons/md";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Theme,
} from "@material-ui/core";
import { useCartStore } from "../../../../core/store/cartStore";
import { Category } from "../../../../models/Category";
import { getCategoriesAll } from "../../../../core/apis/categoriesService";
import { Countries, districts, wards } from "../../../../models/Countries";
import { geo, getCountryAll, gps } from "../../../../core/apis/countryService";
import { useDistanceStore } from "../../../../core/store/distanceStore";
import { AuthService } from "../../../../core/services/authService";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    select: {
      paddingBottom: 10,
      paddingTop: 10,
      display: "flex",
      alignItems: "center",
    },
  })
);
interface productDelete {
  status: boolean;
  id: number | string;
}
function Cart() {
  const [countries, setCountries] = useState<Countries[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [districts, setDistricts] = useState<districts[]>([]);
  const [wards, setWards] = useState<wards[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [LatitudeStart, setLatitudeStart] = useState<number | null>(null);
  const [LongitudeStart, setLongitudeStart] = useState<number | null>(null);
  const [LatitudeEnd, setLatitudeEnd] = useState<number | null>(null);
  const [LongitudeEnd, setLongitudeEnd] = useState<number | null>(null);
  const [total, setTotal] = useState<number>(1);
  const { translates } = useContext(TranslateService);
  const classes = useStyles();
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const reduceQuantity = useCartStore((state) => state.reduceQuantity);
  const [countProduct, setCountProduct] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const moneyToDistance = useDistanceStore((state) => state.moneyToDistance);
  const addTransport = useDistanceStore((state) => state.addTransport);
  const transportt = useDistanceStore((state) => state.transport);
  const [transport, setTransport] = useState<string | null>(null);
  const [transportPrice, setTransportPrice] = useState<number>(0);
  const { auth } = useContext(AuthService);
  const deleteProduct = useCartStore((state) => state.deleteProduct);
  const deleteAll = useCartStore((state) => state.deleteAll);
  const [alert, setAlert] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [productDelete, setProductDelete] = useState<productDelete>({
    status: false,
    id: 0,
  });

  const handleReduce = (id: string | number) => {
    const filterCart = cart.find((item) => item.id === id);
    if (filterCart && filterCart.quantity > 1) {
      reduceQuantity(id, filterCart.quantity);
    }
  };

  const handleAdd = (id: string | number) => {
    const filterCart = cart.find((item) => item.id === id);
    if (filterCart) {
      updateQuantity(id, filterCart.quantity);
    }
  };

  console.log("cart: ", cart);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getCountryAll();
      if (Array.isArray(result.data)) {
        setCountries(result.data);
      }
    };
    fetchApi();
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getCategoriesAll();
      if (Array.isArray(result.data)) {
        setCategories(result.data);
      }
    };
    fetchApi();
  }, []);

  const handleCountryChange = (
    event: React.ChangeEvent<{ value: Countries }>
  ) => {
    const code = event.target.value.code;
    const cityName = event.target.value.name;
    setSelectedCity(cityName);
    const filterCity = countries.find((item) => item.code === code);
    if (filterCity) {
      setDistricts(filterCity.districts);
    }
    console.log("FilterCity: ", event.target.value);
  };

  const handleDistrictsChange = (
    event: React.ChangeEvent<{ value: districts }>
  ) => {
    const code = event.target.value.code;
    const districtName = event.target.value.name;
    setSelectedDistrict(districtName);
    const filterDistricts = districts.find((item) => item.code === code);
    if (filterDistricts) {
      setWards(filterDistricts.wards);
    }
  };

  const handleWardsChange = (event: React.ChangeEvent<{ value: wards }>) => {
    const wards = event.target.value.name;
    setSelectedWard(wards);
  };

  const handleExpressChange = (event: React.ChangeEvent<{ value: string }>) => {
    setTransport(event.target.value);
  };
  console.log("transport:", transport);

  const totalPrice = cart.reduce((sum, item) => {
    return sum + ((100 - item.discount) / 100) * item.price * item.quantity;
  }, 0);

  const handleUpdate = async () => {
    const fullAddress = `${selectedWard}, ${selectedDistrict}, ${selectedCity}, Việt Nam`;
    const query = encodeURIComponent(fullAddress);

    if (!query) return;

    try {
      const result = await gps(query);
      console.log(
        "Kết quả định vị RAW:",
        result.data,
        Array.isArray(result.data)
      );

      // Nếu API trả về mảng → lấy phần tử đầu tiên
      const data = Array.isArray(result.data) ? result.data[0] : result.data;

      if (!data || !data.lat || !data.lon) {
        console.error("Không lấy được lat/lon từ GPS API:", data);
        return;
      }

      const lat = Number(data.lat);
      const lon = Number(data.lon);

      if (isNaN(lat) || isNaN(lon)) {
        console.error("Lỗi ép kiểu lat/lon:", lat, lon);
        return;
      }

      setLatitudeEnd(lat);
      setLongitudeEnd(lon);

      if (
        typeof LongitudeStart === "number" &&
        typeof LatitudeStart === "number"
      ) {
        const distanceResult = await geo(
          LongitudeStart,
          LatitudeStart,
          lon,
          lat
        );
        console.log("Distance: ", distanceResult.data);
        setDistance(
          distanceResult.data.features[0].properties.segments[0].distance
        );
      } else {
        console.warn("Toạ độ bắt đầu chưa có:", LatitudeStart, LongitudeStart);
      }
    } catch (error) {
      console.error("Lỗi khi gọi GPS API:", error);
    }
  };

  const handleDelete = (id: string | number) => {
    if (id) {
      deleteProduct(id);
      setProductDelete({ status: false, id: 0});
    }
  };

  const handleDeleteAll = () => {
    deleteAll();
    setAlert(false);
  };

  const handleBuy = async () => {
    if (distance) {
      const arrayTransport = {
        id: auth.user.id,
        distance: distance,
        typeTransport: transport,
        money: 0, // sẽ cập nhật sau
      };

      await addTransport(arrayTransport); // chờ add xong
      moneyToDistance(auth.user.id);
      setTransportPrice(Math.floor(transportt[0].money));
    }
  };

  const handleVoucher = () => {
    // moneyToDistance(auth.user.id);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitudeStart(position.coords.latitude);
        setLongitudeStart(position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCountProduct(total);
  }, [cart]);

  console.log("  transports  : ", transportt);

  return (
    <div className="layout_cart">
      <Dialog open={alert} onClose={() => setAlert(false)}>
        <DialogTitle>Xác nhận xóa tất cả</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Thông báo — Bạn có chắc muốn xóa tất cả sản phẩm!
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setAlert(false)}>
            Không
          </Button>
          <Button color="secondary" onClick={handleDeleteAll}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={productDelete.status} onClose={() => setProductDelete({status: false, id: 0})}>
        <DialogTitle>Xác nhận xóa </DialogTitle>
        <DialogContent>
          <Alert severity="warning">Thông báo — Bạn có chắc muốn xóa !</Alert>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setProductDelete({status: false, id: 0})}>
            Không
          </Button>
          <Button color="secondary" onClick={() => handleDelete(productDelete.id)}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* <h2>{translates.Shopping_Bag}</h2>
      <p>{countProduct}items in your cart</p> */}
      <Grid container>
        <div className="cart">
          <Grid item xl={9} lg={9}>
            <div className="cart__item">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div className="des" style={{ margin: "15px" }}>
                  <h2>{translates.Shopping_Bag}</h2>
                  <p>{countProduct} items in your cart</p>
                </div>
                <div
                  className="deleteAll"
                  style={{ marginRight: "15px" }}
                  onClick={() => setAlert(true)}
                >
                  <Button color="primary" variant="contained">
                    {translates.DeleteAll}
                  </Button>
                </div>
              </div>

              <TableContainer>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{ paddingRight: 24 }}
                        align="center"
                        className="productt"
                      >
                        {translates.product}
                      </TableCell>
                      <TableCell align="center" className="prices">
                        {translates.Price}
                      </TableCell>
                      <TableCell
                        style={{ width: 60 }}
                        align="center"
                        className="quantities"
                      >
                        {translates.Quantity}
                      </TableCell>
                      <TableCell align="center" className="totalprice">
                        {translates.Total_price}
                      </TableCell>
                      <TableCell align="center" className="action">
                        {translates.Action}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart ? (
                      <>
                        {cart.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell align="center">
                              <div className="product">
                                <img src={item.image} alt="image_product" />
                                <div className="description">
                                  <h3>{item.name}</h3>
                                  <p className="sold">
                                    {translates.Sold}: {item.sold}
                                  </p>
                                  <p className="discount">
                                    {translates.Discount}: {item.discount}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell align="center">
                              <p className="price price_old">
                                {translates.old_price}: đ{item.price}
                              </p>
                              <p className="price price_new">
                                {translates.new_price}: đ
                                {((100 - item.discount) / 100) * item.price}
                              </p>
                            </TableCell>
                            <TableCell style={{ width: 60 }} align="center">
                              <div className="quantity_cart">
                                <button onClick={() => handleReduce(item.id)}>
                                  -
                                </button>
                                <input
                                  type="number"
                                  readOnly
                                  value={item.quantity}
                                  key={item.id}
                                />
                                <button onClick={() => handleAdd(item.id)}>
                                  +
                                </button>
                              </div>
                            </TableCell>
                            <TableCell align="center">
                              <div className="total">
                                đ{" "}
                                {((100 - item.discount) / 100) *
                                  item.price *
                                  item.quantity}
                              </div>
                            </TableCell>
                            <TableCell align="center">
                              <div className="action">
                                <Button>
                                  <div
                                    style={{ fontSize: "24px" }}
                                    onClick={() => setProductDelete({ status: true, id: item.id})}
                                  >
                                    <MdDelete />
                                  </div>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    ) : (
                      <p>Không có sản phẩm nào trong giỏ hàng</p>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid>
          <Grid item xl={2} lg={2}>
            <div className="cart__detail">
              <div className="address">
                <h3>{translates.Address}</h3>
                {countries ? (
                  <>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel id="city">City</InputLabel>
                      <Select
                        labelId="city"
                        label="City"
                        className="select"
                        style={{ width: "200px", height: "30px" }}
                        classes={{ select: classes.select }}
                        onChange={handleCountryChange}
                        MenuProps={{
                          disableScrollLock: true,
                          PaperProps: {
                            style: {
                              maxHeight: 150,
                              overflowY: "auto",
                            },
                          },
                        }}
                        placeholder="Thành phố"
                      >
                        {countries.map((item) => (
                          <MenuItem key={item.code} value={item}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel id="district">District</InputLabel>
                      <Select
                        labelId="district"
                        label="District"
                        className="select"
                        style={{ width: "200px", height: "30px" }}
                        classes={{ select: classes.select }}
                        onChange={handleDistrictsChange}
                        MenuProps={{
                          disableScrollLock: true,
                          PaperProps: {
                            style: {
                              maxHeight: 150,
                              overflowY: "auto",
                            },
                          },
                        }}
                        placeholder="Thành phố"
                      >
                        {districts.map((item) => (
                          <MenuItem value={item} key={item.code}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel id="ward">Ward</InputLabel>
                      <Select
                        labelId="ward"
                        label="Ward"
                        className="select"
                        style={{ width: "200px", height: "30px" }}
                        classes={{ select: classes.select }}
                        onChange={handleWardsChange}
                        MenuProps={{
                          disableScrollLock: true,
                          PaperProps: {
                            style: {
                              maxHeight: 150,
                              overflowY: "auto",
                            },
                          },
                        }}
                        placeholder="Thành phố"
                      >
                        {wards.map((item) => (
                          <MenuItem value={item} key={item.code}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel id="transport">Transport</InputLabel>
                      <Select
                        labelId="transport"
                        label="Transport"
                        className="select"
                        style={{ width: "200px", height: "30px" }}
                        classes={{ select: classes.select }}
                        onChange={handleExpressChange}
                        MenuProps={{
                          disableScrollLock: true,
                          PaperProps: {
                            style: {
                              maxHeight: 150,
                              overflowY: "auto",
                            },
                          },
                        }}
                      >
                        <MenuItem value={"express"}>Express</MenuItem>
                        <MenuItem value={"normal"}>Normal</MenuItem>
                      </Select>
                    </FormControl>
                  </>
                ) : (
                  <>
                    <p>Lỗi khi call API</p>
                  </>
                )}
                <Button className="btn-buy" onClick={handleUpdate}>
                  {translates.update}
                </Button>
              </div>
              <div className="voucher">
                <h3>Voucher</h3>
                <span>
                  Mã giảm giá là một chuỗi ký tự giúp khách hàng nhận ưu đãi khi
                  mua sắm, như giảm giá trực tiếp, miễn phí vận chuyển hoặc quà
                  tặng kèm.
                </span>
                <div className="input">
                  <TextField
                    type="text"
                    placeholder="voucher"
                    variant="outlined"
                  />
                </div>
                <Button className="btn-buy" onClick={handleVoucher}>
                  {translates.apply}
                </Button>
              </div>
              <div className="cart__total">
                <h3>Cart total</h3>
                <div className="total_detail">
                  <div className="title">
                    <span>Tiền thực:</span>
                    <span>
                      <strong>{totalPrice.toLocaleString()} VNĐ</strong>
                    </span>
                  </div>
                  <div className="title">
                    <span>Vận chuyển:</span>
                    <span>
                      <strong> {transportPrice.toLocaleString()}VNĐ</strong>
                    </span>
                  </div>
                  <div className="title">
                    <span>Mã giảm giá: </span>
                  </div>
                  <div className="title">
                    <span>Tổng tiền: </span>
                  </div>
                  <Button onClick={handleBuy} className="btn-buy">
                    Thanh toán
                  </Button>
                </div>
              </div>
            </div>
          </Grid>
        </div>
      </Grid>
    </div>
  );
}

export default Cart;
