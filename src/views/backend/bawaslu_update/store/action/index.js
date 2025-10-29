import axios from 'axios'

// ** Get all Data
export const getAllDataBawasluUpdate = (params) => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/forum/bawaslu-update/all-data`, {params}).then(response => {

      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_BAWASLU_UPDATE',
          data: data.data,
          params
        })
      }
    }).catch(err => {
      const {response} = err
      if (response.status === 404) {
        dispatch({
          type: 'GET_ALL_DATA_BAWASLU_UPDATE',
          data: [],
          params
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getDataBawasluUpdate = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/forum/bawaslu-update`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_BAWASLU_UPDATE',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_BAWASLU_UPDATE',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getBawasluUpdate = value => {
  return async dispatch => {
    dispatch({
      type: 'GET_BAWASLU_UPDATE',
      selected: value
    })
  }
}

// ** Add new BawasluUpdate
export const addBawasluUpdate = params => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_BAWASLU_UPDATE'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/forum/bawaslu-update`, params, {
        onUploadProgress: progressEvent => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          dispatch({
            type: 'PROGRESS_BAWASLU_UPDATE',
            progress
          })
        }
      })
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_BAWASLU_UPDATE',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_BAWASLU_UPDATE'
          })
        } else {
          dispatch({
            type: 'ERROR_BAWASLU_UPDATE',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_BAWASLU_UPDATE',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_BAWASLU_UPDATE',
            error: err.message
          })
        }
      })
      .finally(() => {
        dispatch({
          type: 'PROGRESS_BAWASLU_UPDATE',
          progress: null
        })
        dispatch({
          type: 'RESET_BAWASLU_UPDATE'
        })
      })
  }
}

// ** update BawasluUpdate
export const updateBawasluUpdate = (id, params) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_BAWASLU_UPDATE'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/forum/bawaslu-update/${id}`, params, {
        onUploadProgress: progressEvent => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          dispatch({
            type: 'PROGRESS_BAWASLU_UPDATE',
            progress
          })
        }
      })
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_BAWASLU_UPDATE',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_BAWASLU_UPDATE'
          })
        } else {
          dispatch({
            type: 'ERROR_BAWASLU_UPDATE',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_BAWASLU_UPDATE',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_BAWASLU_UPDATE',
            error: err.message
          })
        }
      }).finally(() => {
        dispatch({
          type: 'PROGRESS_BAWASLU_UPDATE',
          progress: null
        })
        dispatch({
          type: 'RESET_BAWASLU_UPDATE'
        })
      })
  }
}

// ** Delete
export const deleteBawasluUpdate = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/forum/bawaslu-update/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_BAWASLU_UPDATE'
        })
      })
      .finally(() => {
        dispatch(getDataBawasluUpdate(getState().bawasluupdates.params))
      })
      .catch(err => console.log(err))
  }
}