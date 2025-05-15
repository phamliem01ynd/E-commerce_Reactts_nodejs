import { useContext, useEffect, useRef, useState } from "react";
import { TranslateService } from "../../../../core/services/translateService";
import {
  Avatar,
  Badge,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Switch,
} from "@material-ui/core";
import { IoMenu } from "react-icons/io5";
import "./header.scss";
import { ThemeService } from "../../../../core/services/themeService";
import { Link, useSearchParams } from "react-router-dom";
import { AuthService } from "../../../../core/services/authService";
import { IoIosSearch } from "react-icons/io";
import Tooltip from "@material-ui/core/Tooltip";
import { FaCartPlus } from "react-icons/fa";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { useCartStore } from "../../../../core/store/cartStore";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);

function Header() {
  const classes = useStyles();
  const { isLanguage, toggleLanguage } = useContext(TranslateService);
  const [activeButton, setActiveButton] = useState<string>("Home");
  const [searchStatus, setSearchStatus] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [countProduct, setCountProduct] = useState<number>(0);
  const cart = useCartStore((state) => state.cart);
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCountProduct(total);
  }, [cart]);
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search") || ""
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonStyle = (name: string) => ({
    background: activeButton === name ? "#fafa" : "",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElAvatar, setAnchorElAvatar] = useState<null | HTMLElement>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickAvatar = (event: React.MouseEvent<unknown>) => {
    setAnchorElAvatar(event.currentTarget);
    console.log("noname");
  };

  const handleSearch = () => {
    setSearchStatus(!searchStatus);
    setIsOpen(!isOpen);
    setSearchParams({ search: searchTerm });
    if (searchTerm === "") {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("search");
      setSearchParams(newSearchParams);
    }
  };
  const { theme, toggleTheme } = useContext(ThemeService);
  const { auth, setAuth } = useContext(AuthService);
  const { translates } = useContext(TranslateService);
  console.log("auth: ", auth);

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElAvatar(null);
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("access_token");
    setAuth({
      isAuthenticated: false,
      user: {
        id: null,
        name: null,
        email: null,
        phone: null,
        image: null,
      },
    });
  };
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setSearchStatus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <header>
      <div className="header">
        <div className="layout">
          <img src="vite.svg" alt="logo" />
          <div className="layout__right">
            <div
              className={`formSearch ${searchStatus ? "action" : ""}`}
              ref={formRef}
            >
              <Tooltip title="search">
                <input
                  type="text"
                  placeholder="search..."
                  className={`input ${searchStatus ? "action" : ""}`}
                  onClick={handleSearch}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Tooltip>
              <div className="icon">
                <IoIosSearch onClick={handleSearch} />
              </div>
            </div>
            <Select
              value={isLanguage}
              onChange={toggleLanguage}
              className="select"
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="VI">VI</MenuItem>
              <MenuItem value="ENG">ENG</MenuItem>
            </Select>

            <Switch
              checked={theme === "light"}
              onChange={toggleTheme}
              name="theme"
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
            <div className="person">
              {auth.isAuthenticated || localStorage.getItem("access_token") ? (
                <>
                  <Avatar
                    className="avatar"
                    alt="avatar"
                    src={auth.user.image}
                    aria-controls="simple-avatar"
                    aria-haspopup="true"
                    onClick={handleClickAvatar}
                    tabIndex={0}
                    style={{ margin: "15px" }}
                  ></Avatar>
                  <Menu
                    className="menu"
                    id="simple-avatar"
                    anchorEl={anchorElAvatar}
                    keepMounted
                    disableScrollLock
                    open={Boolean(anchorElAvatar)}
                    onClose={handleClose}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem key="profile" onClick={handleClose}>
                      <Link to={"/profile"}>{translates.profile}</Link>
                    </MenuItem>
                    <MenuItem key="contact" onClick={handleClose}>
                      <Link to={"/contact"}>{translates.contact}</Link>
                    </MenuItem>
                    <MenuItem key="logout" onClick={handleLogout}>
                      <Link to={"/login"}>{translates.logout}</Link>
                    </MenuItem>
                  </Menu>
                  <div className={classes.root}>
                    <Badge badgeContent={countProduct} color="error">
                      <Link to={"/cart"}>
                        {" "}
                        <FaCartPlus style={{ fontSize: "18px" }} />
                      </Link>
                    </Badge>
                  </div>
                </>
              ) : (
                <>
                  <IconButton
                    aria-label="Menu"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <IoMenu />
                  </IconButton>
                  <Menu
                    className="menu"
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    disableScrollLock
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <MenuItem key="login" onClick={handleClose}>
                      <Link to={"/login"}>{translates.login}</Link>
                    </MenuItem>
                    <MenuItem key="register" onClick={handleClose}>
                      <Link to={"/register"}>{translates.register}</Link>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="header-menu">
        <Button
          style={buttonStyle("Home")}
          onClick={() => setActiveButton("Home")}
        >
          <Link to={"/"}>Home</Link>
        </Button>
        <Button
          style={buttonStyle("Product")}
          onClick={() => setActiveButton("Product")}
        >
          <Link to={"/"}>Product</Link>
        </Button>
        <Button
          style={buttonStyle("About")}
          onClick={() => setActiveButton("About")}
        >
          <Link to={"/"}>About</Link>
        </Button>
        <Button
          style={buttonStyle("Contact")}
          onClick={() => setActiveButton("Contact")}
        >
          <Link to={"/"}>Contact</Link>
        </Button>
        <Button
          style={buttonStyle("Shop")}
          onClick={() => setActiveButton("Shop")}
        >
          <Link to={"/shop"}>Shop</Link>
        </Button>
      </div>
    </header>
  );
}

export default Header;
