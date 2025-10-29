import axios from 'axios'

// ** Get all Data
export const getAllDataContent = (params) => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/reff/content/all-data`, {params}).then(response => {

      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_CONTENT',
          data: data.data,
          params
        })
      }
    }).catch(err => {
      const {response} = err
      if (response.status === 404) {
        dispatch({
          type: 'GET_ALL_DATA_CONTENT',
          data: [],
          params
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getDataContent = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/reff/content`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_CONTENT',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_CONTENT',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getContent = value => {
  return async dispatch => {
    dispatch({
      type: 'GET_CONTENT',
      selected: value
    })
  }
}

// ** Add new Content
export const addContent = params => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_CONTENT'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/reff/content`, params)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_CONTENT',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_CONTENT'
          })
        } else {
          dispatch({
            type: 'ERROR_CONTENT',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_CONTENT',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_CONTENT',
            error: err.message
          })
        }
      })
      .finally(() => {
        dispatch({
          type: 'RESET_CONTENT'
        })
      })
  }
}

// ** update Content
export const updateContent = (id, params) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_CONTENT'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/reff/content/${id}`, params)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_CONTENT',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_CONTENT'
          })
        } else {
          dispatch({
            type: 'ERROR_CONTENT',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_CONTENT',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_CONTENT',
            error: err.message
          })
        }
      }).finally(() => {
        dispatch({
          type: 'RESET_CONTENT'
        })
      })
  }
}

// ** Delete
export const deleteContent = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/reff/content/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_CONTENT'
        })
      })
      .finally(() => {
        dispatch(getDataContent(getState().contents.params))
      })
      .catch(err => console.log(err))
  }
}