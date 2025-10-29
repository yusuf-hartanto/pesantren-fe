import axios from 'axios'

// ** get statistik
export const getStatistikDasboard = (cb = null) => {
    return (dispatch, getState) => {
  
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/report/summary/dashboard`)
        .then(response => {
  
          const {data} = response
  
          if (cb) {
            cb(data)
          }
        })
    }
  }