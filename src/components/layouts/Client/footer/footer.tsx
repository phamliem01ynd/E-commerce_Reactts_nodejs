import { Grid } from "@material-ui/core";
import "./footer.scss";
import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
function Footer(){
  return(
    <>
      <div className="footer">
              <div className="footer__customer">
                <h3>Customer Service</h3>
                <ul>
                  <li>
                    <a href="/">Help Centre</a>
                  </li>
                  <li>
                    <a href="/">enndme Blog</a>
                  </li>
                  <li>
                    <a href="/">enndme Mall</a>
                  </li>
                  <li>
                    <a href="/">How To Buy</a>
                  </li>
                  <li>
                    <a href="/">How To Sell</a>
                  </li>
                  <li>
                    <a href="/">Payment</a>
                  </li>
                  <li>
                    <a href="/">enndme Coins</a>
                  </li>
                  <li>
                    <a href="/">Shipping</a>
                  </li>
                  <li>
                    <a href="/">Return & Refund</a>
                  </li>
                  <li>
                    <a href="/">Contact Us</a>
                  </li>
                  <li>
                    <a href="/">Warranty Policy</a>
                  </li>
                </ul>
              </div>
              <div className="footer__about">
                <h3>ABOUT SHOPPE</h3>
                <ul>
                  <li>
                    <a href="/">About Us</a>
                  </li>
                  <li>
                    <a href="/">enndme Careers</a>
                  </li>
                  <li>
                    <a href="/">enndme Policies</a>
                  </li>
                  <li>
                    <a href="/">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="/">enndme Mall</a>
                  </li>
                  <li>
                    <a href="/">Seller Centre</a>
                  </li>
                  <li>
                    <a href="/">Flash Deals</a>
                  </li>
                  <li>
                    <a href="/">enndme Ambassador Programme</a>
                  </li>
                  <li>
                    <a href="/">Media Contact</a>
                  </li>
                </ul>
              </div>
              <div className="footer__payment">
                <h3>PAYMENT</h3>
                <img
                  src="	https://down-vn.img.susercontent.com/file/d4bbea4570b93bfd5fc652ca82a262a8"
                  alt="visa"
                />
                <img
                  src="	https://down-vn.img.susercontent.com/file/a0a9062ebe19b45c1ae0506f16af5c16"
                  alt="visa"
                />
                <img
                  src="	https://down-vn.img.susercontent.com/file/38fd98e55806c3b2e4535c4e4a6c4c08"
                  alt="visa"
                />
                <img
                  src=" https://down-vn.img.susercontent.com/file/bc2a874caeee705449c164be385b796c"
                  alt="visa"
                />
                <img
                  src="	https://down-vn.img.susercontent.com/file/2c46b83d84111ddc32cfd3b5995d9281"
                  alt="visa"
                />
                <img
                  src="	https://down-vn.img.susercontent.com/file/5e3f0bee86058637ff23cfdf2e14ca09"
                  alt="visa"
                />
                <img
                  src="	https://down-vn.img.susercontent.com/file/9263fa8c83628f5deff55e2a90758b06"
                  alt="visa"
                />
                <img
                  src="	https://down-vn.img.susercontent.com/file/0217f1d345587aa0a300e69e2195c492"
                  alt="visa"
                />
                <div className="footer__logistics">
                  <h3>LOGISTICS</h3>
                  <img
                    src="https://down-vn.img.susercontent.com/file/vn-11134258-7ras8-m20rc1wk8926cf"
                    alt="visa"
                  />
                  <img
                    src="	https://down-vn.img.susercontent.com/file/vn-50009109-64f0b242486a67a3d29fd4bcf024a8c6"
                    alt="visa"
                  />
                  <img
                    src="	https://down-vn.img.susercontent.com/file/59270fb2f3fbb7cbc92fca3877edde3f"
                    alt="visa"
                  />
                  <img
                    src="	https://down-vn.img.susercontent.com/file/957f4eec32b963115f952835c779cd2c"
                    alt="visa"
                  />
                  <img
                    src="	https://down-vn.img.susercontent.com/file/0d349e22ca8d4337d11c9b134cf9fe63"
                    alt="visa"
                  />
                  <img
                    src="	https://down-vn.img.susercontent.com/file/3900aefbf52b1c180ba66e5ec91190e5"
                    alt="visa"
                  />
                  <img
                    src="	https://down-vn.img.susercontent.com/file/6e3be504f08f88a15a28a9a447d94d3d"
                    alt="visa"
                  />
                  <img
                    src="	https://down-vn.img.susercontent.com/file/0b3014da32de48c03340a4e4154328f6"
                    alt="visa"
                  />
                  <img
                    src="	https://down-vn.img.susercontent.com/file/vn-50009109-ec3ae587db6309b791b78eb8af6793fd"
                    alt="visa"
                  />
                </div>
              </div>
              <div className="footer__follow">
                <h3>FOLLOW US</h3>
                <div className="footer__follow-icon">
                  <div className="icon">
                    <FaFacebook /><span>Facebook</span> 
                  </div>
                  <div className="icon">
                    <FaInstagram /> <span>Instagram</span>
                  </div>
                  <div className="icon">
                    <FaLinkedin /><span>LinkedIn</span> 
                  </div>
                </div>
              </div>
              <div className="footer__app">
                <h3>ENNDME APP DOWNLOAD</h3>
                <div className="footer__app-one">
                  <div className="qrcode">
                    <QRCodeSVG value="https://www.youtube.com/" size={100} />
                  </div>
                  <div className="footer__app-icon">
                    <img
                      src="https://down-vn.img.susercontent.com/file/ad01628e90ddf248076685f73497c163"
                      alt="AppStore"
                    />
                    <img
                      src="https://down-vn.img.susercontent.com/file/ae7dced05f7243d0f3171f786e123def"
                      alt="Google"
                    />
                    <img
                      src="https://down-vn.img.susercontent.com/file/35352374f39bdd03b25e7b83542b2cb0"
                      alt="AppGallery"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="footer2">
              <div className="footer2__le"></div>
              <div className="footer2__content">
                <div className="footer2__copyright">
                  <span>
                    © 2024 enndme. Tất cả các quyền được bảo lưu.
                  </span>
                </div>
                <div className="notation">
                  <span>
                  Quốc gia & Khu vực: Singapore | Indonesia | Thái | Lan | Malaysia |
                  Việt Nam Philippines | Brazil | México | Colombia | Chile | Đài Loan
                  </span>
                </div>
              </div>
            </div>
            <div className="footer3">
              <div className="footer3__title">
                <Grid style={{textAlign: 'center'}}>
                  <Grid item xl={3}>CHÍNH SÁCH BẢO MẬT</Grid>
                  <Grid item xl={3}>QUY CHẾ HOẠT ĐỘNG</Grid>
                  <Grid item xl={3}>CHÍNH SÁCH VẬN CHUYỂN</Grid>
                  <Grid item xl={3}>CHÍNH SÁCH VẬN HÀNH VÀ HOÀN TIỀN</Grid>
                </Grid>
              </div>
              <div className="footer3__certificate">
                <img
                  src='carousel/Untitled_one.png'
                  alt="certificate"
                />
                <div className="footer3__text">Công ty TNHH Shoppe</div>
                <div className="footer3__text">
                  Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai,
                  Phường Ngọc Khánh, Quận Ba Đình, Thành phố Hà Nội, Việt Nam. Tổng
                  đài hỗ trợ: 19001221 - Email: cskh@hotro.enndme.vn
                </div>
                <div className="footer3__text">
                  Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Bùi Anh Tuấn
                </div>
                <div className="footer3__text">
                  Mã số doanh nghiệp: 0106773786 do Sở Kế hoạch & Đầu tư TP Hà Nội cấp
                  lần đầu ngày 10/02/2015
                </div>
                <div className="footer3__text">
                  © 2015 - Bản quyền thuộc về Công ty TNHH enndme
                </div>
              </div>
            </div>
    </>
  )
}

export default Footer;