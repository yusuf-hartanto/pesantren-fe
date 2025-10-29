import axios from 'axios'

// ** Get data on page or row change
export const getDataStatistikPengguna = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/report/summary/pengguna`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_STATISTIK_PENGGUNA',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_STATISTIK_PENGGUNA',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getStatistikPengguna = value => {
  return async dispatch => {
    dispatch({
      type: 'GET_STATISTIK_PENGGUNA',
      selected: value
    })
  }
}

// ** Add new StatistikPengguna
export const addStatistikPengguna = params => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_STATISTIK_PENGGUNA'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/report/summary/pengguna`, params)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_STATISTIK_PENGGUNA',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_STATISTIK_PENGGUNA'
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_PENGGUNA',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_STATISTIK_PENGGUNA',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_PENGGUNA',
            error: err.message
          })
        }
      })
      .finally(() => {
        dispatch({
          type: 'RESET_STATISTIK_PENGGUNA'
        })
      })
  }
}

// ** update StatistikPengguna
export const updateStatistikPengguna = (id, params) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_STATISTIK_PENGGUNA'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/report/summary/pengguna/${id}`, params)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_STATISTIK_PENGGUNA',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_STATISTIK_PENGGUNA'
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_PENGGUNA',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_STATISTIK_PENGGUNA',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_PENGGUNA',
            error: err.message
          })
        }
      }).finally(() => {
        dispatch({
          type: 'RESET_STATISTIK_PENGGUNA'
        })
      })
  }
}

// ** Delete
export const deleteStatistikPengguna = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/report/summary/pengguna/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_STATISTIK_PENGGUNA'
        })
      })
      .finally(() => {
        dispatch(getDataStatistikPengguna(getState().statistikpenggunas.params))
      })
      .catch(err => console.log(err))
  }
}