import './App.css';
import './template/Head';
import Footer from './template/Footer';
import RoutePages from './components/RoutePages';

function App() {

  return (
    <>
      <RoutePages/>
      {/* <HeadWithImages/> */}
      <Footer/>
    </>
  )
}

export default App;
