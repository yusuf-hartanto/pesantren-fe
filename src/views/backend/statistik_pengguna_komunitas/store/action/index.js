import axios from 'axios'

// ** Get data on page or row change
export const getDataStatistikPenggunaKomunitas = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/report/summary/pengguna-komunitas`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_STATISTIK_PENGGUNA_KOMUNITAS',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_STATISTIK_PENGGUNA_KOMUNITAS',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getStatistikPenggunaKomunitas = value => {
  return async dispatch => {
    dispatch({
      type: 'GET_STATISTIK_PENGGUNA_KOMUNITAS',
      selected: value
    })
  }
}

// ** Add new StatistikPenggunaKomunitas
export const addStatistikPenggunaKomunitas = params => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_STATISTIK_PENGGUNA_KOMUNITAS'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/report/summary/pengguna-komunitas`, params)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_STATISTIK_PENGGUNA_KOMUNITAS',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_STATISTIK_PENGGUNA_KOMUNITAS'
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_PENGGUNA_KOMUNITAS',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_STATISTIK_PENGGUNA_KOMUNITAS',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_PENGGUNA_KOMUNITAS',
            error: err.message
          })
        }
      })
      .finally(() => {
        dispatch({
          type: 'RESET_STATISTIK_PENGGUNA_KOMUNITAS'
        })
      })
  }
}

// ** update StatistikPenggunaKomunitas
export const updateStatistikPenggunaKomunitas = (id, params) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_STATISTIK_PENGGUNA_KOMUNITAS'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/report/summary/pengguna-komunitas/${id}`, params)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_STATISTIK_PENGGUNA_KOMUNITAS',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_STATISTIK_PENGGUNA_KOMUNITAS'
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_PENGGUNA_KOMUNITAS',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_STATISTIK_PENGGUNA_KOMUNITAS',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_PENGGUNA_KOMUNITAS',
            error: err.message
          })
        }
      }).finally(() => {
        dispatch({
          type: 'RESET_STATISTIK_PENGGUNA_KOMUNITAS'
        })
      })
  }
}

// ** Delete
export const deleteStatistikPenggunaKomunitas = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/report/summary/pengguna-komunitas/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_STATISTIK_PENGGUNA_KOMUNITAS'
        })
      })
      .finally(() => {
        dispatch(getDataStatistikPenggunaKomunitas(getState().statistikpenggunakomunitass.params))
      })
      .catch(err => console.log(err))
  }
}