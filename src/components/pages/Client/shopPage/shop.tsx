import React, { useContext, useEffect, useState } from "react";
import { Category } from "../../../../models/Category";
import { Product } from "../../../../models/Product";
import { getCategoriesAll } from "../../../../core/apis/categoriesService";
import { paginationProduct } from "../../../../core/apis/productService";
import { Link, useSearchParams } from "react-router-dom";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@material-ui/core";
import "./shop.scss";
import ProductShop from "../../../common/productShop/productShop";
import { TranslateService } from "../../../../core/services/translateService";

function Shop() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [quantityPage, setQuantityPage] = useState<number>(1);
  const [pageParams, setPageParams] = useSearchParams();
  const [actionCategoryFilter, setActionCategoryFilter] =
    useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryDetail, setCategoryDetail] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);

  const { translates } = useContext(TranslateService);
  useEffect(() => {
    const page = pageParams.get("page") || "1";
    const category_id = pageParams.get("id") || "";
    const sort = pageParams.get("sort") || "";
    const fetchApi = async () => {
      const [result1, result2] = await Promise.all([
        paginationProduct(page, category_id, sort),
        getCategoriesAll(),
      ]);
      if (Array.isArray(result1.data.products) && Array.isArray(result2.data)) {
        setProducts(result1.data.products);
        setQuantityPage(result1.data.quantityPage);
        setCategories(result2.data);
      }
    };
    fetchApi();
  }, [pageParams]);
  console.log("prodyctPage: ", products);
  console.log("category: ", categories);

  const handleChangeDetailCategory = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (event.target.value) {
      setCategoryDetail(event.target.value);
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      const sort = event.target.value;
      const params = new URLSearchParams(pageParams);
      params.set("sort", sort);
      setPageParams(params);
    }
  };

  const handleShowAllProduct = () => {
    const newParams = new URLSearchParams();
    newParams.set("page", "1");
    setPageParams(newParams);
  };

  const handleChangeCategory = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (event.target.value) {
      setActionCategoryFilter(true);
      const categoryId = event.target.value;
      const params = new URLSearchParams(pageParams);
      params.set("id", categoryId);
      setPageParams(params);
    }
  };
  const handleChangee = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  console.log("SortProduct: ", products);
  return (
    <div>
      <div>
        <Link to={"/"}>Home</Link>/ Shop
      </div>
      <div className="shop">
        <Grid container spacing={6}>
          <Grid item xl={2} lg={2} md={4} sm={4} xs={4}>
            <div className="categoryFilter">
              <h3>{translates.filterProduct}</h3>
              <div className="productall">
                <Button
                  onClick={handleShowAllProduct}
                  style={{
                    width: "160px",
                    height: "30px",
                    borderRadius: "15px",
                    margin: "12px",
                    background: "#fafa",
                  }}
                >
                  {translates.ProductAll}
                </Button>
              </div>
              {categories ? (
                <>
                  <FormControl variant="outlined" className="category">
                    <InputLabel id="category">{translates.category}</InputLabel>
                    <Select
                      labelId="city"
                      label="City"
                      className="select"
                      style={{ width: "160px", height: "30px" }}
                      onChange={handleChangeCategory}
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
                      {categories.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              ) : (
                <p>Không tìm thấy danh mục</p>
              )}
              <div>
                <FormControl variant="outlined" className="sort">
                  <InputLabel id="sort">{translates.Sort}</InputLabel>
                  <Select
                    labelId="city"
                    label="City"
                    className="select"
                    style={{ width: "160px", height: "30px" }}
                    onChange={handleOnChange}
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
                    <MenuItem value="asc">Giá tăng dần</MenuItem>
                    <MenuItem value="desc">Giá giảm dần</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div>
                {actionCategoryFilter ? (
                  <div>
                    <FormControl variant="outlined" className="sort">
                      <InputLabel id="hiddenCategoryFilter">
                        Detail Filter
                      </InputLabel>
                      <Select
                        labelId="hiddenCategoryFilter"
                        className="select"
                        style={{ width: "160px", height: "30px" }}
                        onChange={handleChangeDetailCategory}
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
                        <MenuItem value="RAM">{translates.Ram}</MenuItem>
                        <MenuItem value="OS">{translates.OS}</MenuItem>
                        <MenuItem value="Storage">
                          {translates.Storage}
                        </MenuItem>
                        <MenuItem value="Capacity">
                          {translates.Capacity}
                        </MenuItem>
                        <MenuItem value="Connect">
                          {translates.Connect}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div>
                {actionCategoryFilter ? (
                  <>
                    <FormControl component="fieldset" className="sort">
                      <FormLabel
                        component="legend"
                        style={{ textAlign: "center" }}
                      >
                        Chọn dung lượng RAM
                      </FormLabel>
                      <RadioGroup value={value} onChange={handleChangee}>
                        <FormControlLabel
                          value="a"
                          control={<Radio />}
                          label="64GB"
                        />
                        <FormControlLabel
                          value="b"
                          control={<Radio />}
                          label="128GB"
                        />
                        <FormControlLabel
                          value="c"
                          control={<Radio />}
                          label="256GB"
                        />
                      </RadioGroup>
                    </FormControl>
                  </>
                ) : (
                  ""
                )}
              </div>
              ;
            </div>
          </Grid>
          <Grid item xl={10} lg={10} md={8} sm={8} xs={8}>
            <div className="shop__image">
              <img src="carousel/macbook.jpg" alt="img" />
            </div>
            <div className="productShop">
              <ProductShop products={products} quantityPage={quantityPage} />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Shop;
