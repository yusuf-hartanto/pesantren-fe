import axios from 'axios'

// ** Get all Data
export const getAllDataCategory = (params) => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/reff/category/all-data`, {params}).then(response => {

      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_CATEGORY',
          data: data.data,
          params
        })
      }
    }).catch(err => {
      const {response} = err
      if (response.status === 404) {
        dispatch({
          type: 'GET_ALL_DATA_CATEGORY',
          data: [],
          params
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getDataCategory = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/reff/category`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_CATEGORY',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_CATEGORY',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getCategory = value => {
  return async dispatch => {
    dispatch({
      type: 'GET_CATEGORY',
      selected: value
    })
  }
}

// ** Add new Category
export const addCategory = params => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_CATEGORY'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/reff/category`, params, {
        onUploadProgress: progressEvent => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          dispatch({
            type: 'PROGRESS_CATEGORY',
            progress
          })
        }
      })
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_CATEGORY',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_CATEGORY'
          })
        } else {
          dispatch({
            type: 'ERROR_CATEGORY',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_CATEGORY',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_CATEGORY',
            error: err.message
          })
        }
      })
      .finally(() => {
        dispatch({
          type: 'PROGRESS_CATEGORY',
          progress: null
        })
        dispatch({
          type: 'RESET_CATEGORY'
        })
      })
  }
}

// ** update Category
export const updateCategory = (id, params) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_CATEGORY'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/reff/category/${id}`, params, {
        onUploadProgress: progressEvent => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          dispatch({
            type: 'PROGRESS_CATEGORY',
            progress
          })
        }
      })
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_CATEGORY',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_CATEGORY'
          })
        } else {
          dispatch({
            type: 'ERROR_CATEGORY',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_CATEGORY',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_CATEGORY',
            error: err.message
          })
        }
      }).finally(() => {
        dispatch({
          type: 'PROGRESS_CATEGORY',
          progress: null
        })
        dispatch({
          type: 'RESET_CATEGORY'
        })
      })
  }
}

// ** Delete
export const deleteCategory = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/reff/category/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_CATEGORY'
        })
      })
      .finally(() => {
        dispatch(getDataCategory(getState().categorys.params))
      })
      .catch(err => console.log(err))
  }
}