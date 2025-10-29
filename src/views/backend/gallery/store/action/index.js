import axios from 'axios'

// ** Get all Data
export const getAllDataGallery = (params) => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/reff/gallery/all-data`, {params}).then(response => {

      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_GALLERY',
          data: data.data,
          params
        })
      }
    }).catch(err => {
      const {response} = err
      if (response.status === 404) {
        dispatch({
          type: 'GET_ALL_DATA_GALLERY',
          data: [],
          params
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getDataGallery = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/reff/gallery`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_GALLERY',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_GALLERY',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getGallery = value => {
  return async dispatch => {
    dispatch({
      type: 'GET_GALLERY',
      selected: value
    })
  }
}

// ** Add new Gallery
export const addGallery = params => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_GALLERY'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/reff/gallery`, params, {
        onUploadProgress: progressEvent => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          dispatch({
            type: 'PROGRESS_GALLERY',
            progress
          })
        }
      })
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_GALLERY',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_GALLERY'
          })
        } else {
          dispatch({
            type: 'ERROR_GALLERY',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err

        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_GALLERY',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_GALLERY',
            error: err.message
          })
        }
      })
      .finally(() => {
        dispatch({
          type: 'PROGRESS_GALLERY',
          progress: null
        })
        dispatch({
          type: 'RESET_GALLERY'
        })
      })
  }
}

// ** update Gallery
export const updateGallery = (id, params) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_GALLERY'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/reff/gallery/${id}`, params, {
        onUploadProgress: progressEvent => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          dispatch({
            type: 'PROGRESS_GALLERY',
            progress
          })
        }
      })
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_GALLERY',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_GALLERY'
          })
        } else {
          dispatch({
            type: 'ERROR_GALLERY',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_GALLERY',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_GALLERY',
            error: err.message
          })
        }
      }).finally(() => {
        dispatch({
          type: 'PROGRESS_GALLERY',
          progress: null
        })
        dispatch({
          type: 'RESET_GALLERY'
        })
      })
  }
}

// ** Delete
export const deleteGallery = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/reff/gallery/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_GALLERY'
        })
      })
      .finally(() => {
        dispatch(getDataGallery(getState().gallerys.params))
      })
      .catch(err => console.log(err))
  }
}