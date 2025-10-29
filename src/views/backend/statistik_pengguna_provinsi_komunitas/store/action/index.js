import axios from 'axios'

// ** Get data on page or row change
export const getDataStatistikPenggunaProvinceKomunitas = params => {
  return async dispatch => {

    dispatch({
      type: 'REQUEST_STATISTIK_PENGGUNA_PROVINCE_KOMUNITAS'
    })

    await axios.get(`${process.env.REACT_APP_BASE_URL}/report/summary/pengguna-province-komunitas`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_STATISTIK_PENGGUNA_PROVINCE_KOMUNITAS',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_STATISTIK_PENGGUNA_PROVINCE_KOMUNITAS',
            data: [],
            totalPages: 0,
            params
          })
        }
      }).finally(() => {
        dispatch({
          type: 'RESET_STATISTIK_PENGGUNA_PROVINCE_KOMUNITAS'
        })
      })
  }
}