import { Outlet } from "react-router-dom";
import Header from "../Client/header/header";

function LayoutAdmin(){
  return (
    <>
      <Header/>
      <Outlet/>
    </>
  )
}

export default LayoutAdmin;