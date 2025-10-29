import axios from 'axios'

// ** Get data on page or row change
export const getDataStatistikArtikelKomunitas = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/report/summary/article-komunitas`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_STATISTIK_ARTIKEL_KOMUNITAS',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_STATISTIK_ARTIKEL_KOMUNITAS',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getStatistikArtikelKomunitas = value => {
  return async dispatch => {
    dispatch({
      type: 'GET_STATISTIK_ARTIKEL_KOMUNITAS',
      selected: value
    })
  }
}

// ** Add new StatistikArtikelKomunitas
export const addStatistikArtikelKomunitas = params => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_STATISTIK_ARTIKEL_KOMUNITAS'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/report/summary/article-komunitas`, params)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_STATISTIK_ARTIKEL_KOMUNITAS',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_STATISTIK_ARTIKEL_KOMUNITAS'
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_ARTIKEL_KOMUNITAS',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_STATISTIK_ARTIKEL_KOMUNITAS',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_ARTIKEL_KOMUNITAS',
            error: err.message
          })
        }
      })
      .finally(() => {
        dispatch({
          type: 'RESET_STATISTIK_ARTIKEL_KOMUNITAS'
        })
      })
  }
}

// ** update StatistikArtikelKomunitas
export const updateStatistikArtikelKomunitas = (id, params) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_STATISTIK_ARTIKEL_KOMUNITAS'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/report/summary/article-komunitas/${id}`, params)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_STATISTIK_ARTIKEL_KOMUNITAS',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_STATISTIK_ARTIKEL_KOMUNITAS'
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_ARTIKEL_KOMUNITAS',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_STATISTIK_ARTIKEL_KOMUNITAS',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_ARTIKEL_KOMUNITAS',
            error: err.message
          })
        }
      }).finally(() => {
        dispatch({
          type: 'RESET_STATISTIK_ARTIKEL_KOMUNITAS'
        })
      })
  }
}

// ** Delete
export const deleteStatistikArtikelKomunitas = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/report/summary/article-komunitas/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_STATISTIK_ARTIKEL_KOMUNITAS'
        })
      })
      .finally(() => {
        dispatch(getDataStatistikArtikelKomunitas(getState().statistikartikelkomunitass.params))
      })
      .catch(err => console.log(err))
  }
}