import { Backdrop, Button, Fade, FormControl, IconButton, InputLabel, MenuItem, Modal, Paper, Select, TextField } from "@material-ui/core";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { deleteProduct, editProduct, getProductAll, searchProduct } from "../../../../core/apis/productService";
import { Product } from "../../../../models/Product";
import { useSearchParams } from "react-router-dom";
import { IoIosCopy } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormInput, ProductSchema } from "../../../../shares/validationProductSchema";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import "./productPage.scss";
import { TranslateService } from "../../../../core/services/translateService";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { Alert, AlertTitle } from "@material-ui/lab";
import { getCategoriesAll } from "../../../../core/apis/categoriesService";
import { Category } from "../../../../models/Category";
import ScrollTop from "../../../common/scroll/scroll";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      width:800,
      heigh:600,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }),
);

const useStylesTable = makeStyles({
  table: {
    minWidth: 650,
    '& th, & td': {
      fontSize: '16px', // chỉnh kích thước font tại đây
    },
  },
});

function ProductPage(){
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { translates } = useContext(TranslateService);
  const [ product, setProduct ] = useState<Product[]>([]);
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('search') || '');
  const [checkCopy, setCheckCopy] = useState<{ [key: number]: boolean }>({});
  const [ selectedProduct, setSelectedProduct ] = useState<Product | null>(null);
  const [ categories, setCategories ] = useState<Category[]>([]); 
  const classTable = useStylesTable();

  useEffect(() => {
      const fetchApi = async () => {
        const result = await getCategoriesAll();
        if(Array.isArray(result.data)){
          setCategories(result.data)
        }
      }
      fetchApi();
    },[])
  useEffect(() => {
    const fetchApi = async () => {
      const result = await getProductAll();
      if(Array.isArray(result.data)){
        setProduct(result.data);
      }
    }
    fetchApi();
  },[])
  console.log("product: ",product);
  

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const currentSearch = searchParams.get('search') || '';
      const fetchApi = async() => {
        const result = await searchProduct(currentSearch);
        if(Array.isArray(result.data)){
          setProduct(result.data);
        }
      } 
      
      fetchApi();
    },500)
    
    return () => clearTimeout(delayDebounce);
  },[searchParams])


  const handleSearch = (e : React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search : searchTerm})
  }
  
  const handleEdit = async (id : string | number) => {
    const editProduct = product.find((item) => item.id === id)
    if(editProduct){
      setSelectedProduct(editProduct); 
      reset({
        name: editProduct.name,
        discount: editProduct.discount,
        price: editProduct.price,
        quantity: editProduct.quantity,
      })
      setImagePreview(editProduct.image || null); // set ảnh (nếu có)
      setOpen(true);
    }    
  }

  const handleDelete = async (id : string | number) => {
    return await deleteProduct(id);
  }

  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    setSearchTerm(currentSearch);
  }, [searchParams]);

  const handleOnchange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const [ alert, setAlert ] = useState<{ visible: boolean, message: string}>({ visible: false, message: ''});


  const handleCopy = async (name : string, id: number | string ) => {
    try {
      await navigator.clipboard.writeText(name);
      setAlert({ visible: true, message: 'copy complete'})
      setCheckCopy((item) => ({
        ...item,
        [id]: true
      }))
      setTimeout(() => {
        setAlert({ visible: false, message: 'copy complete'})
        setCheckCopy((item) => ({
          ...item,
          [id]: false
        }))
      },3000)
    } catch (error) {
      console.error("Không thể copy: ", error);
    }
  }

  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const handleOpen = () => {
    reset(); // reset toàn bộ form về rỗng
    setSelectedProduct(null); // đảm bảo không còn dữ liệu edit
    setImagePreview(null); // clear ảnh preview
    setOpen(true); // mở mod
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [selectedCategory, setSelectedCategory] = useState('');

  const handleChange = (event: any) => {
    const value = event.target.value as string;
    console.log("Selected category: ", value);
    setSelectedCategory(value);
  };
  console.log("selected Categories: ", selectedCategory);
  

  const onSubmit: SubmitHandler<ProductFormInput> = async (data) => {
    console.log("Du lieu hop le: ", data);
    if(selectedProduct){
      return await editProduct(data);
    }
    else{
      const formData = new FormData();
      formData.append('name', data.name);
    }
    reset();
    setSelectedProduct(null);
    setImagePreview(null);
    setOpen(false);
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProductFormInput>({
    resolver: zodResolver(ProductSchema)
  })

  const handleOnChangeImage = (e : ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if(file){
      const reader = new FileReader();
      reader.onload = () => {
        if( typeof reader.result === "string"){
          setImagePreview(reader.result);
          setSelectedImage(file)
        }
      }
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="productPageAdmin">
      <ScrollTop/>
      <Button style={{ background: '#fafa'}} onClick={handleOpen}>Add Product</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        disableScrollLock
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
        <div className={classes.paper}>
            <h2 id="transition-modal-title">Product</h2>
            <div id="transition-modal-description">
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display: 'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                <TextField type="text" variant="outlined" label='ProductName' {...register('name')} error={!!errors.name} 
                  helperText={errors.name?.message}/>
                <TextField type="number" variant="outlined" label='Discount' {...register('discount', { valueAsNumber: true})} 
                  error={!!errors.discount} helperText={errors.discount?.message}/>
                <TextField variant="outlined"/>
                </div>
                <div style={{ display: 'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                <input type="file" onChange={handleOnChangeImage}/>
                <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="selectCategories">Danh Muc</InputLabel>
                <Select className='select' 
                  value={selectedCategory}
                  onChange={handleChange} 
                  MenuProps={{
                  disableScrollLock: true,
                  PaperProps: {
                    style: {
                      maxHeight: 150, // giới hạn chiều cao, ví dụ 300px
                      overflowY: 'auto',
                    },
                  },
                  }} labelId="selectCategories">
                  {categories ? (<>
                    {categories.map((item) => (
                      <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                    ))}
                  </>): (<><span>Không tìm thấy danh mục sản phẩm</span></>)}
                </Select>
                </FormControl>
                  {imagePreview && (
                      <div style={{ marginTop: 10 }}>
                        <img src={imagePreview} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                      </div>
                  )}
                  </div>
                  <div>
                    <Button type="submit">{selectedProduct ? 'Update Product' : 'Add Product'}</Button>
                  </div>
              </form>
            </div>
          </div>
        </Fade>
      </Modal>
      <form onSubmit={handleSearch}>
        <TextField type="text" value={searchTerm} onChange={handleOnchange} />
          <Button type="submit">Search</Button>
      </form>
      <div className='table'>
      <TableContainer component={Paper}>
      <Table className={classTable.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell align="center">{translates.productName}</TableCell>
            <TableCell align="center">{translates.Image}</TableCell>
            <TableCell align="center">{translates.Discount}</TableCell>
            <TableCell align="center">{translates.Sold}</TableCell>
            <TableCell align="center">{translates.Price}</TableCell>
            <TableCell align="center">{translates.Quantity}</TableCell>
            <TableCell align="center">{translates.Action}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {product.length > 0 ? (<>
            {product.map((item) => (
            <TableRow key={item.name}>
              <TableCell component="th" scope="row">
                {item.id}
              </TableCell>
              <TableCell align="center">{item.name} 
              <IconButton aria-label="copy" onClick={() => {
                if (item.id !== undefined) {
                  handleCopy(item.name, item.id);
                } else {
                  console.error("ID is undefined, cannot copy.");
                }
              }}>                
                {checkCopy[item.id] ? <FaCheck/> : <IoIosCopy />}
          </IconButton>
              </TableCell>
              <TableCell align="center">
                <img src={item.image} alt="img" style={{ width: '50px', height: '50px'}}/>
              </TableCell>
              <TableCell align="center">{item.discount}</TableCell>
              <TableCell align="center">{item.sold}</TableCell>
              <TableCell align="center">{item.price}</TableCell>
              <TableCell align="center">{item.quantity}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleEdit(item.id)}><MdEdit />
                </IconButton>
                <IconButton onClick={() => handleDelete(item.id)}><MdDelete />
                </IconButton>
              </TableCell>
            </TableRow>
            
          ))}
          </>) : (<>
          <span>Không tìm thấy sản phẩm</span>
          </>)}
        </TableBody>
      </Table>
    </TableContainer>
      </div>
      {alert.visible && (
            <Alert severity="success" style={{ marginTop: 10 }}>
              <AlertTitle>Success</AlertTitle>
              {alert.message}
            </Alert>
          )}
    </div>
  )
}

export default ProductPage;