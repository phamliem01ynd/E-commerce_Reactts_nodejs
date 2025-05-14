import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/layouts/Client/header/header'
import Footer from './components/layouts/Client/footer/footer'

function App() {

  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default App
