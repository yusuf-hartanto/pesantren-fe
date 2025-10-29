import axios from 'axios'

// ** Get data on page or row change
export const getDataStatistikArtikelTema = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/report/summary/article-tema`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_STATISTIK_ARTIKEL_TEMA',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_STATISTIK_ARTIKEL_TEMA',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getStatistikArtikelTema = value => {
  return async dispatch => {
    dispatch({
      type: 'GET_STATISTIK_ARTIKEL_TEMA',
      selected: value
    })
  }
}

// ** Add new StatistikArtikelTema
export const addStatistikArtikelTema = params => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_STATISTIK_ARTIKEL_TEMA'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/report/summary/article-tema`, params)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_STATISTIK_ARTIKEL_TEMA',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_STATISTIK_ARTIKEL_TEMA'
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_ARTIKEL_TEMA',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_STATISTIK_ARTIKEL_TEMA',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_ARTIKEL_TEMA',
            error: err.message
          })
        }
      })
      .finally(() => {
        dispatch({
          type: 'RESET_STATISTIK_ARTIKEL_TEMA'
        })
      })
  }
}

// ** update StatistikArtikelTema
export const updateStatistikArtikelTema = (id, params) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_STATISTIK_ARTIKEL_TEMA'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/report/summary/article-tema/${id}`, params)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_STATISTIK_ARTIKEL_TEMA',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_STATISTIK_ARTIKEL_TEMA'
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_ARTIKEL_TEMA',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_STATISTIK_ARTIKEL_TEMA',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_STATISTIK_ARTIKEL_TEMA',
            error: err.message
          })
        }
      }).finally(() => {
        dispatch({
          type: 'RESET_STATISTIK_ARTIKEL_TEMA'
        })
      })
  }
}

// ** Delete
export const deleteStatistikArtikelTema = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/report/summary/article-tema/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_STATISTIK_ARTIKEL_TEMA'
        })
      })
      .finally(() => {
        dispatch(getDataStatistikArtikelTema(getState().statistikartikelTemas.params))
      })
      .catch(err => console.log(err))
  }
}