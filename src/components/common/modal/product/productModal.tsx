import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductAll } from '../../../../core/apis/productService';
import { Product } from '../../../../models/Product';
import { Category } from '../../../../models/Category';
import { getCategoriesAll } from '../../../../core/apis/categoriesService';
import { Rating } from '@material-ui/lab';
import "./productModal.scss";
interface ProductModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}
function ProductModal({ open, setOpen} : ProductModalProps){

  const [ products, setProduct ] = useState<Product[]>([])
  const [ categories, setCategories ] = useState<Category[]>([])
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchApi = async () => {
      const [ result1, result2] = await Promise.all([
        getProductAll(),
        getCategoriesAll()
      ])
      if(Array.isArray(result1.data) && Array.isArray(result2.data)){
        setProduct(result1.data);
        setCategories(result2.data)
      }
    }
    fetchApi();
  },[])

  const params = useParams();
  const paramsId = params.id
  console.log(paramsId);

  const filterProduct = products.find((item) => item.id === Number(paramsId));
  const fiterCategories = categories.find((item) => item.id === filterProduct?.category_id)
  console.log('filterProduct: ', filterProduct);
  console.log('filterCategory: ', fiterCategories);

  
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Product Detail"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {filterProduct ? (
                      <div className="productDetail">
                        <div className="productDetail__image">
                          <img
                            src={filterProduct.image}
                            alt={filterProduct.name}
                          />
                          <div className="productDetail__name">
                            {filterProduct.name}
                          </div>
                        </div>
                        <div className="productDetail__about">
                          <div className="productDetail__type">
                            Xu hướng sản phẩm: Sản phẩm bán chạy
                          </div>
                          <div className="productDetail__cate">
                            Loại sản phẩm :{" "}
                            {fiterCategories
                              ? fiterCategories.name
                              : "Loading category..."}
                          </div>
                          <div className="productDetail__oldprice">
                            Giá cũ: {filterProduct.price} đ
                          </div>
                          <div className="productDetail__discount">
                            Giảm giá: {filterProduct.discount} %
                          </div>
                          <div className="productDetail__newprice">
                            Giá mới:{" "}
                            {((100 - filterProduct.discount) / 100) *
                              filterProduct.price}{" "}
                            đ
                          </div>
                          <div className="productDetail__des">
                            Mô tả: {filterProduct.description}
                          </div>
                          <div>
                            Đánh giá: <Rating precision={0.5} defaultValue={4.5} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p>Không tìm thấy sản phẩm</p>
                    )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ProductModal;