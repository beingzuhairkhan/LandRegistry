import Router from '../routes/Router'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
const Layout = ()=>{
    return(
        <>
          <Header/>
          <Router/>
          <Footer/>
        </>
    )
}

export default Layout