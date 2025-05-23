import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import {
  ProductFormInput,
  ProductSchema,
} from "../../../../shares/validationProductSchema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useState } from "react";
import "./productModalAdmin.scss";
import { Category } from "../../../../models/Category";
import { getCategoriesAll } from "../../../../core/apis/categoriesService";
import {
  createProduct,
  editProduct,
  getProductById,
} from "../../../../core/apis/productService";
interface StatusProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}
function ProductModalAdmin(props: StatusProps) {
  const { open, setOpen } = props;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [description, setDescription] = useState<string>("");
  const [imagefile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const handleClose = () => {
    navigate("/admin/product");
    setOpen(false);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategoriesAll();
      if (Array.isArray(res.data)) {
        setCategory(res.data);
      }
    };
    fetchCategory();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(ProductSchema),
  });

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeCategory = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCategory(e.target.value as number);
  };

  useEffect(() => {
    const fetchProductById = async () => {
      if (id) {
        const res = await getProductById(id);
        const product = res.data;
        reset({
          name: product.name,
          quantity: product.quantity,
          price: product.price,
          discount: product.discount,
        });
        setImagePreview(product.image);
        setSelectedCategory(product.categoryId);
        setDescription(product.description);
      }
    };

    fetchProductById();
  }, [id]);

  const onSubmit: SubmitHandler<ProductFormInput> = async (data) => {
    // data.description = description;
    if (data) {
      const formData = new FormData();
      formData.append("name", data.name);
      if (imagePreview) {
        formData.append("image", imagefile as Blob);
      }
      formData.append("quantity", data.quantity.toString());
      formData.append("price", data.price.toString());
      formData.append("discount", data.discount.toString());
      formData.append("description", description);
      formData.append("categoryId", selectedCategory?.toString() || "");
      if (id) {
        await editProduct(formData); // EDIT
      } else {
        await createProduct(formData); // CREATE
      }
    }
    setOpen(false);
  };

  return (
    <>
      <Dialog
        onClose={handleClose}
        open={open}
        className="productModalAdmin"
        maxWidth="lg"
      >
        <DialogTitle id="simple-dialog-title">
          {id ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} id="product-form">
            <div className="form-left">
              <TextField
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                label="Tên sản phẩm"
                variant="outlined"
                type="text"
                className="input"
              />
              <TextField
                variant="outlined"
                {...register("quantity", { valueAsNumber: true })}
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
                type="number"
                label="Quantity"
                className="input"
              />
              <TextField
                variant="outlined"
                {...register("price", { valueAsNumber: true })}
                error={!!errors.price}
                helperText={errors.price?.message}
                type="number"
                label="Price"
                className="input"
              />
              <Editor
                placeholder="Description"
                apiKey="akhr3qzwn6pjxuk8zhcge1he1znp26xfmmae9i5yw6no0cio"
                value={description}
                onEditorChange={(newValue) => setDescription(newValue)}
                init={{
                  height: 200,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </div>
            <div className="form-right">
              <TextField
                variant="outlined"
                {...register("discount", { valueAsNumber: true })}
                error={!!errors.discount}
                helperText={errors.discount?.message}
                type="number"
                label="Discount"
                className="input"
              />
              <FormControl variant="outlined">
                <InputLabel id="city">Danh mục</InputLabel>
                <Select
                  labelId="city"
                  label="City"
                  className="input select"
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
                  {category &&
                    category.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <TextField
                type="file"
                onChange={(e) => handleChangeImage(e)}
                variant="outlined"
                className="input"
              />
              <div className="imagePreview">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: 200, height: "auto" }}
                  />
                )}
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button form="product-form" type="submit" color="primary">
            {id ? "Edit Product" : "Add Product"}
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProductModalAdmin;
