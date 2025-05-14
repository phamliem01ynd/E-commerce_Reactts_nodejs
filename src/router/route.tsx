import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../components/pages/Client/login/login";
import Home from "../components/pages/Client/home/home";
import Register from "../components/pages/Client/register/register";
import LayoutAdmin from "../components/layouts/Admin/layoutAdmin";
import ProductPage from "../components/pages/admin/productPage/productPage";
import ProductClient from "../components/pages/Client/productPage/productPage";
import Cart from "../components/pages/Client/cart/cart";
import Shop from "../components/pages/Client/shopPage/shop";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element:<Home/>
      },
      {
        path:'home/:id',
        element:<Home/>
      },
      {
        path:'/product/:id',
        element:<ProductClient/>
      },
      {
        path: "/login",
        element: <Login/>,
      },
      {
        path:'/register',
        element:<Register/>,
      },
      {
        path:'/cart',
        element:<Cart/>
      },
      {
        path:'/shop',
        element:<Shop/>
      }
    ]
  },
  {
    path:"Admin",
    element:<LayoutAdmin/>,
    children:[
      {
        path:'product',
        element:<ProductPage/>
      }
    ]
  }
])