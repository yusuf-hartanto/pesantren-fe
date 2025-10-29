import axios from 'axios'

// ** Get all Data
export const getAllDataArticle = (params) => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/forum/article/all-data`, {params}).then(response => {

      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_ARTICLE',
          data: data.data,
          params
        })
      }
    }).catch(err => {
      const {response} = err
      if (response.status === 404) {
        dispatch({
          type: 'GET_ALL_DATA_ARTICLE',
          data: [],
          params
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getDataArticle = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/forum/article`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_ARTICLE',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_ARTICLE',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getArticle = value => {
  return async dispatch => {
    dispatch({
      type: 'GET_ARTICLE',
      selected: value
    })
  }
}

// ** Add new Article
export const addArticle = params => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_ARTICLE'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/forum/article`, params, {
        onUploadProgress: progressEvent => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          dispatch({
            type: 'PROGRESS_ARTICLE',
            progress
          })
        }
      })
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_ARTICLE',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_ARTICLE'
          })
        } else {
          dispatch({
            type: 'ERROR_ARTICLE',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_ARTICLE',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_ARTICLE',
            error: err.message
          })
        }
      })
      .finally(() => {
        dispatch({
          type: 'PROGRESS_ARTICLE',
          progress: null
        })
        dispatch({
          type: 'RESET_ARTICLE'
        })
      })
  }
}

// ** update Article
export const updateArticle = (id, params, cb = null) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_ARTICLE'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/forum/article/${id}`, params, {
        onUploadProgress: progressEvent => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          dispatch({
            type: 'PROGRESS_ARTICLE',
            progress
          })
        }
      })
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_ARTICLE',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_ARTICLE'
          })

          if (cb) {
            cb(data)
          }
        } else {
          dispatch({
            type: 'ERROR_ARTICLE',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_ARTICLE',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_ARTICLE',
            error: err.message
          })
        }
      }).finally(() => {
        dispatch({
          type: 'PROGRESS_ARTICLE',
          progress: null
        })
        dispatch({
          type: 'RESET_ARTICLE'
        })
      })
  }
}

// ** Delete
export const deleteArticle = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/forum/article/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_ARTICLE'
        })
      })
      .finally(() => {
        dispatch(getDataArticle(getState().articles.params))
      })
      .catch(err => console.log(err))
  }
}