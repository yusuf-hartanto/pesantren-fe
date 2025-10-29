// ** Logo
import logo from '@src/assets/images/logo/loading.jpg'

const SpinnerComponent = () => {

  return (
    <div className="page-preloader">
      <div id="loading-wrapper">
        <div className="front" style={{background: `url(${logo})no-repeat`}}/>
        <div className="center" style={{background: `url(${logo})no-repeat`}}/>
        <div className="center2" style={{background: `url(${logo})no-repeat`}}/>
        <div className="center3" style={{background: `url(${logo})no-repeat`}}/>
        <div className="back" style={{background: `url(${logo})no-repeat`}}/>
      </div>
    </div>
  )
}

export default SpinnerComponent