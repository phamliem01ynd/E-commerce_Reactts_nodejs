import { Button, IconButton, Paper, TextField } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import {
  getProductAll,
  searchProduct,
} from "../../../../core/apis/productService";
import { Product } from "../../../../models/Product";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoIosCopy } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import "./productPage.scss";
import { TranslateService } from "../../../../core/services/translateService";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { Alert, AlertTitle } from "@material-ui/lab";
import ScrollTop from "../../../common/scroll/scroll";
import ProductModalAdmin from "../../../common/modal/product/productModalAdmin";

function ProductPage() {
  const { translates } = useContext(TranslateService);
  const [product, setProduct] = useState<Product[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search") || ""
  );
  const [checkCopy, setCheckCopy] = useState<{ [key: number]: boolean }>({});
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchApi = async () => {
      const result = await getProductAll();
      if (Array.isArray(result.data)) {
        setProduct(result.data);
      }
    };
    fetchApi();
  }, []);
  console.log("product: ", product);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";
      const fetchApi = async () => {
        const result = await searchProduct(currentSearch);
        if (Array.isArray(result.data)) {
          setProduct(result.data);
        }
      };

      fetchApi();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search: searchTerm });
  };

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setSearchTerm(currentSearch);
  }, [searchParams]);

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const [alert, setAlert] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  const handleCopy = async (name: string, id: number | string) => {
    try {
      await navigator.clipboard.writeText(name);
      setAlert({ visible: true, message: "copy complete" });
      setCheckCopy((item) => ({
        ...item,
        [id]: true,
      }));
      setTimeout(() => {
        setAlert({ visible: false, message: "copy complete" });
        setCheckCopy((item) => ({
          ...item,
          [id]: false,
        }));
      }, 3000);
    } catch (error) {
      console.error("Không thể copy: ", error);
    }
  };

  const handleEdit = (id: number | string) => {
    navigate(`/admin/product/edit/${id}`);
    setOpen(true);
  };
  return (
    <div className="productPageAdmin">
      <ScrollTop />
      <Button style={{ background: "#fafa" }} onClick={() => setOpen(true)}>
        Add Product
      </Button>
      <ProductModalAdmin open={open} setOpen={setOpen} />
      <form onSubmit={handleSearch}>
        <TextField type="text" value={searchTerm} onChange={handleOnchange} />
        <Button type="submit">Search</Button>
      </form>
      <div className="table">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
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
              {product.length > 0 ? (
                <>
                  {product.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell component="th" scope="row">
                        {item.id}
                      </TableCell>
                      <TableCell align="center">
                        {item.name}
                        <IconButton
                          aria-label="copy"
                          onClick={() => {
                            if (item.id !== undefined) {
                              handleCopy(item.name, item.id);
                            } else {
                              console.error("ID is undefined, cannot copy.");
                            }
                          }}
                        >
                          {checkCopy[item.id] ? <FaCheck /> : <IoIosCopy />}
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <img
                          src={item.image}
                          alt="img"
                          style={{ width: "50px", height: "50px" }}
                        />
                      </TableCell>
                      <TableCell align="center">{item.discount}</TableCell>
                      <TableCell align="center">{item.sold}</TableCell>
                      <TableCell align="center">{item.price}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleEdit(item.id)}>
                          <MdEdit />
                        </IconButton>
                        <IconButton>
                          <MdDelete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <>
                  <span>Không tìm thấy sản phẩm</span>
                </>
              )}
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
  );
}

export default ProductPage;
