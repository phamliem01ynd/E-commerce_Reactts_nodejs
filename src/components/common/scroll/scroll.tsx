import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import './scroll.scss'
function ScrollTop (){
  const [ visibleScroll, setVisibleScroll ] = useState<boolean>(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setVisibleScroll(true);
      } else {
        setVisibleScroll(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility); 
  }, []);
  console.log("ScrollTop component mounted");

  const handleScrollToTop = () => {
    window.scrollTo({
      top:0,
      behavior:'smooth'
    })
  }
  return (
    <>
      { visibleScroll ? (
        <>
        
        <div className={`scroll ${visibleScroll ? 'block' : 'none'}`} onClick={handleScrollToTop}>
          <FaArrowUp />
        </div>
        </>
      ): ('')}
      
    </>
  )
}

export default ScrollTop;