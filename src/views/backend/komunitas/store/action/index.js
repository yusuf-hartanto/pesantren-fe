import axios from 'axios'

// ** Get all Data
export const getAllDataKomunitas = (cb = null) => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/reff/komunitas/all-data`).then(response => {

      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_KOMUNITAS',
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
          type: 'GET_ALL_DATA_KOMUNITAS',
          data: []
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getDataKomunitas = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/reff/komunitas`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_KOMUNITAS',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_KOMUNITAS',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getKomunitas = value => {
  return async dispatch => {
    dispatch({
      type: 'GET_KOMUNITAS',
      selected: value
    })
  }
}

// ** Add new Komunitas
export const addKomunitas = params => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_KOMUNITAS'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/reff/komunitas`, params, {
        onUploadProgress: progressEvent => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          dispatch({
            type: 'PROGRESS_KOMUNITAS',
            progress
          })
        }
      })
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_KOMUNITAS',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_KOMUNITAS'
          })
        } else {
          dispatch({
            type: 'ERROR_KOMUNITAS',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_KOMUNITAS',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_KOMUNITAS',
            error: err.message
          })
        }
      })
      .finally(() => {
        dispatch({
          type: 'PROGRESS_KOMUNITAS',
          progress: null
        })
        dispatch({
          type: 'RESET_KOMUNITAS'
        })
      })
  }
}

// ** update Komunitas
export const updateKomunitas = (id, params) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_KOMUNITAS'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/reff/komunitas/${id}`, params, {
        onUploadProgress: progressEvent => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          dispatch({
            type: 'PROGRESS_KOMUNITAS',
            progress
          })
        }
      })
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_KOMUNITAS',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_KOMUNITAS'
          })
        } else {
          dispatch({
            type: 'ERROR_KOMUNITAS',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_KOMUNITAS',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_KOMUNITAS',
            error: err.message
          })
        }
      }).finally(() => {
        dispatch({
          type: 'PROGRESS_KOMUNITAS',
          progress: null
        })
        dispatch({
          type: 'RESET_KOMUNITAS'
        })
      })
  }
}

// ** Delete
export const deleteKomunitas = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/reff/komunitas/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_KOMUNITAS'
        })
      })
      .finally(() => {
        dispatch(getDataKomunitas(getState().komunitass.params))
      })
      .catch(err => console.log(err))
  }
}