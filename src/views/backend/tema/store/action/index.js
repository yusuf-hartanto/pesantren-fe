import axios from 'axios'

// ** Get all Data
export const getAllDataTema = (cb = null) => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/reff/tema/all-data`).then(response => {

      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_TEMA',
          data: data.data
        })

        if (cb) {
          cb(data.data)
        }
      }
    }).catch(err => {
      const {response} = err
      if (response.status === 404) {
        dispatch({
          type: 'GET_ALL_DATA_TEMA',
          data: []
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getDataTema = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/reff/tema`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_TEMA',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_TEMA',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getTema = value => {
  return async dispatch => {
    dispatch({
      type: 'GET_TEMA',
      selected: value
    })
  }
}

// ** Add new Tema
export const addTema = params => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_TEMA'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/reff/tema`, params, {
        onUploadProgress: progressEvent => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          dispatch({
            type: 'PROGRESS_TEMA',
            progress
          })
        }
      })
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_TEMA',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_TEMA'
          })
        } else {
          dispatch({
            type: 'ERROR_TEMA',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_TEMA',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_TEMA',
            error: err.message
          })
        }
      })
      .finally(() => {
        dispatch({
          type: 'PROGRESS_TEMA',
          progress: null
        })
        dispatch({
          type: 'RESET_TEMA'
        })
      })
  }
}

// ** update Tema
export const updateTema = (id, params) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_TEMA'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/reff/tema/${id}`, params, {
        onUploadProgress: progressEvent => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          dispatch({
            type: 'PROGRESS_TEMA',
            progress
          })
        }
      })
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_TEMA',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_TEMA'
          })
        } else {
          dispatch({
            type: 'ERROR_TEMA',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_TEMA',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_TEMA',
            error: err.message
          })
        }
      }).finally(() => {
        dispatch({
          type: 'PROGRESS_TEMA',
          progress: null
        })
        dispatch({
          type: 'RESET_TEMA'
        })
      })
  }
}

// ** Delete
export const deleteTema = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/reff/tema/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_TEMA'
        })
      })
      .finally(() => {
        dispatch(getDataTema(getState().temas.params))
      })
      .catch(err => console.log(err))
  }
}