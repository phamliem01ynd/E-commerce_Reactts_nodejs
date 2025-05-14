import React, { useContext, useEffect, useState } from "react";
import { Category } from "../../../../models/Category";
import { Product } from "../../../../models/Product";
import { getCategoriesAll } from "../../../../core/apis/categoriesService";
import { paginationProduct } from "../../../../core/apis/productService";
import { Link, useSearchParams } from "react-router-dom";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
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
  const { translates } = useContext(TranslateService);
  useEffect(() => {
    const page = pageParams.get("page") || "1";
    const fetchApi = async () => {
      const [result1, result2] = await Promise.all([
        paginationProduct(page),
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

  const [categoryProduct, setCategoryProduct] = useState<number | null>(null);
  const [sortPrice, setSortPrice] = useState<string | null>(null);

  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortPrice(event.target.value);
  };

  const filterCategoryProduct = categoryProduct
    ? products.filter((item) => item.category_id === categoryProduct)
    : products;
  const sortProduct = [...filterCategoryProduct].sort((a, b) => {
    if (sortPrice === "Giá tăng dần") {
      return (
        ((100 - a.discount) / 100) * a.price -
        ((100 - b.discount) / 100) * b.price
      );
    }
    if (sortPrice === "Giá giảm dần") {
      return (
        ((100 - b.discount) / 100) * b.price -
        ((100 - a.discount) / 100) * a.price
      );
    }
  });
  const handleShowAllProduct = () => {
    setCategoryProduct(null);
  };

  const handleChangeCategory = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategoryProduct(event.target.value);
  };

  console.log("categoryid: ", categoryProduct);

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
                    <MenuItem value="Giá tăng dần">Giá tăng dần</MenuItem>
                    <MenuItem value="Giá giảm dần">Giá giảm dần</MenuItem>
                  </Select>
                </FormControl>
              </div>
              ;
            </div>
          </Grid>
          <Grid item xl={10} lg={10} md={8} sm={8} xs={8}>
            <div className="shop__image">
              <img src="carousel/macbook.jpg" alt="img" />
            </div>
            <div className="productShop">
              <ProductShop products={sortProduct} quantityPage={quantityPage} />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Shop;
