import { useContext, useEffect, useState } from "react";
import { Category } from "../../../../models/Category";
import { getCategoriesAll } from "../../../../core/apis/categoriesService";
import { Grid } from "@material-ui/core";
import "./home.scss";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Product } from "../../../../models/Product";
import { getProductAll, searchProduct } from "../../../../core/apis/productService";
import ProductAll from "../../../common/product/product";
import { TranslateService } from "../../../../core/services/translateService";
import ScrollTop from "../../../common/scroll/scroll";
import { useLocation } from "react-router-dom";
// Import Swiper styles
function Home() {
  const imageCarousel = [
    {
      id:1,
      image:"carousel/apple_watch.jpg",
    },
    {
      id:2,
      image:"carousel/iphone.webp",

    },
    {
      id:3,
      image:"carousel/iphone2.png",

    },
    {
      id:4,
      image:"carousel/macbook.jpg"  
    },
  ]
  const [ categories, setCategories] = useState<Category[]>([]);
  const [ products, setProducts ] = useState<Product[]>([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search');

  useEffect(() => {
    const delayFetchApi = setTimeout(() => {
     const fetchApi = async () => {
      const result = await searchProduct(searchTerm)
      if(Array.isArray(result.data)){
        setProducts(result.data);
      }
     } 
     fetchApi();
    },300)
    return () => clearTimeout(delayFetchApi);
  },[searchTerm])

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getProductAll();
      if(Array.isArray(result.data)){
        setProducts(result.data);
      }
    }
    fetchApi();
  },[])  
  const { translates } = useContext(TranslateService);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getCategoriesAll();
      if(Array.isArray(result.data)){
        setCategories(result.data)
      }
    }
    fetchApi();
  },[])
  console.log("category >>: ", categories);
  
  return(
    <div className="homePage">
      <ScrollTop/>
      <div className="Content1">
        <Grid container spacing={3}>
          {categories ? (
            <>
              {categories.map((item) => (
                <Grid item xl={1} lg={1} md={1} sm={2} xs={2} key={item.id}>
                  <div className="categories">
                    <div className="image">
                    <img src={item.image} alt="imgCategory" />
                    </div>
                    <span>{item.name}</span>
                  </div>
                </Grid>
              ))}
            </>
          ) : (<>
            <span style={{ color: '#424242', fontSize:'24px'}}>Không tìm thấy danh mục sản phẩm</span>
          </>)}
        </Grid>
      </div>
      <div className="Content2">
      <Swiper
      // install Swiper modules
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 3000 }}
      loop={true}
      speed={1000} 
      pagination={{ clickable: true }}
      navigation
      slidesPerView={1}
      style={{ position: 'relative' }}
    >
      {imageCarousel.map((item) => (
        <SwiperSlide key={item.id}>
          <div className="image-wrapper">
            <img src={item.image} alt="imgCarousel" />
            <div className="overlay"></div>
          </div>
          <div className="Content2__title">
        <div className="title1"><span>Awesome Theme For All Your Needs</span></div>
        <h2>Start Up Your Creative Engine</h2>
        <span>Import all of the StartIt demo content in mere minutes with the one-click import. What are you waiting for?
          StarIt right now.</span>
        <div className="button">
          <button className="action">CHECK IT OUT</button>
          <button>BUY THE PRODUCT</button>
        </div>
      </div>
        </SwiperSlide>
      ))}
        </Swiper>
      </div>
      <div className="Content3">
        <div className="Content3__product">
          <h2>{translates.product}</h2>
          <ProductAll products={products}/>
        </div>

        <div className="Content3__sales">
          <h2>{translates.product_best_selling}</h2>
          <ProductAll products={products.filter((item) => item.sold >= 25)}/>
        </div>

        <div className="Content3__supperSale">
          <h2>{translates.product_supper_sale}</h2>
          <ProductAll products={products.filter((item) => item.discount >= 15)}/>
        </div>
      </div>
    </div>
  )
}

export default Home;