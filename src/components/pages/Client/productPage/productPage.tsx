import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Product } from "../../../../models/Product";
import { getProductAll } from "../../../../core/apis/productService";
import { Category } from "../../../../models/Category";
import { getCategoriesAll } from "../../../../core/apis/categoriesService";
import { Button, FormControl, TextField } from "@material-ui/core";
import { AiOutlineGlobal } from "react-icons/ai";
import { RiRefund2Line } from "react-icons/ri";
import { RiBillLine } from "react-icons/ri";
import { IoWalletOutline } from "react-icons/io5";
import ProductAll from "../../../common/product/product";
import "./productPage.scss";
import { Rating } from "@material-ui/lab";
function ProductPage (){
  const params = useParams();
  const [ products , setProducts] = useState<Product[]>([]);
  const [ categories, setCategories] = useState<Category[]>([]);
  const [isZoom, setIsZoom] = useState(false);
  const [ valueInput, setValueInput ] = useState<number>(1);
  const productId = Number(params.id);
  useEffect(() => {
    const fetchApi = async () => {
      const [ result1, result2] = await Promise.all([
        getProductAll(),
        getCategoriesAll()
      ])
      if(Array.isArray(result1.data) && Array.isArray(result2.data)){
        setProducts(result1.data);
        setCategories(result2.data);        
      } 
    }
    fetchApi();
  },[])
  const filterProduct = products.find((item) => item.id === productId);
  const filterCategories = filterProduct ? categories.find((item) => item.id === filterProduct?.category_id) : null
  
  const handleReduceQuantity = () => {
    if( valueInput > 1){
      setValueInput((item) => item - 1);
    }
  }

  const handleAddQuantity = () => {
    setValueInput((item) => item + 1)
  }
  
  
  return(
    <>
    <div style={{margin:'20px 0px 20px 20px'}}>
          <Link to="/" style={{color: 'black', fontWeight: '500'}}>Home / </Link>
          {params.productName}
          </div>  
              {filterProduct ? (
                <>
                <div className='productPage'>            
                  <div className='productPage__originalPhoto'>
                    <img src={filterProduct.image} alt={filterProduct.name} className={isZoom ? "zoom" : ""} onClick={() => setIsZoom(!isZoom)}/>
                  </div>
                  <div className='productPage__title'>
                    <h2>{filterProduct.name}</h2>
                    <p>Danh mục :{filterCategories ? filterCategories.name : 'Loading category...'}</p>
                    <div className='rate'> 
                      <span className='buy'>lượt mua: {filterProduct.sold}</span>
                      <span>Lượt thích: 06</span>
                    </div>
                    <Rating value={4.5} precision={0.5}/>
                    <p style={{color:'green'}}>Trạng thái: còn hàng</p>
                    <div className='price'>
                      <span>{filterProduct.price}đ</span>
                      <span>{((100 - filterProduct.discount)/100) *filterProduct.price}đ</span>
                      </div>
                      <div className='quantity'>
                        <span>Số lượng: </span> <button onClick={handleReduceQuantity}>-</button>
                        <input value={valueInput} readOnly defaultValue={1} style={{ textAlign:'center', borderRadius:'10px'}}></input>
                        <button onClick={handleAddQuantity}>+</button>                       
                        <span>{filterProduct.quantity} sản phẩm có sẵn</span>
                      </div>
                      <div>
                        <Button style={{background: '#000', color:'#fff'}}>
                          <Link to="/cart">Thêm vào giỏ hàng</Link></Button>
                      </div>        
                    </div>
                    </div>
                    <div className='ProductPageDetail'>
                      <div className='description'>
                        <h2>Mô tả sản phẩm</h2>
                        <span>
                          {filterProduct.description}
                        </span>
                        <h2>Chính sách</h2>
                        <p>
                        Tại Việt Nam, về chính sách bảo hành và đổi trả của Apple, "sẽ được áp dụng chung" theo các điều khoản được liệt kê dưới đây:
                        </p>
                        <p>
                        1) Chính sách chung: https://www.apple.com/legal/warranty/products/warranty-rest-of-apac-vietnamese.html
                        </p>
                        <p>
                        2) Chính sách cho phụ kiện: https://www.apple.com/legal/warranty/products/accessory-warranty-vietnam.html
                        </p>
                        <p>
                        3) Các trung tâm bảo hành Apple ủy quyền tại Việt Nam: https://getsupport.apple.com/repair-locations?locale=vi_VN
                        </p>
                      </div>
                      <div className='contact'>
                        <div className='contact1'>
                        <h2>Quyền lợi</h2>
                        <div  className='title'>
                          <AiOutlineGlobal className='icon'/>
                          <span>Vận chuyển toàn quốc</span>
                        </div>
                        <div className='title'>
                        <RiRefund2Line className='icon'/>
                        <span>Hoàn trả miễn phí trong 7 ngày nếu đủ điều kiện</span>
                        </div>
                        <div className='title'>
                        <RiBillLine className='icon'/>
                        <span>Nhà cung cấp đưa ra hóa đơn cho sản phẩm này</span>
                        </div>
                        <div className='title'>
                        <IoWalletOutline className='icon'/>
                        <span>Thanh toán trực tuyến hoặc nhận hàng</span>
                        </div>
                      </div>
                      <div className='contact2'>
                        <h2>Liên Hệ</h2>
                          <FormControl>
                            <TextField placeholder='Nhập email'/>
                            <div>
                              <Button>Gửi</Button>
                            </div>
                          </FormControl>
                        </div>
                        </div>                    
                    </div>
                    </>
              ):
              (
                <p>Không tìm thấy sản phẩm</p>
              )}
            <div className='productPage2'>
              <h2>Sản phẩm</h2>
              <ProductAll products = {products}/>
            </div>
    </>
  )
}

export default ProductPage;