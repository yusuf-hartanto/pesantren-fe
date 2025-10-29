import axios from 'axios'

// ** Get data on page or row change
export const getDataNotification = (params, cb = null) => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/notif`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          if (cb) {
            cb(data)
          } else {
            dispatch({
              type: 'GET_DATA_NOTIFICATION',
              data: data.data.values,
              totalPages: data.data.total,
              params
            })
          }
          
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404 && !cb) {
          dispatch({
            type: 'GET_DATA_NOTIFICATION',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getNotification = value => {
  return async dispatch => {
    dispatch({
      type: 'GET_NOTIFICATION',
      selected: value
    })
  }
}

// ** update Notification
export const updateNotification = (id, params, cb = null) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_NOTIFICATION'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/notif/${id}`, params)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_NOTIFICATION',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_NOTIFICATION'
          })
        } else {
          dispatch({
            type: 'ERROR_NOTIFICATION',
            error: data.message
          })
        }

        if (cb) {
          cb(data)
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_NOTIFICATION',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_NOTIFICATION',
            error: err.message
          })
        }
      }).finally(() => {
        dispatch({
          type: 'RESET_NOTIFICATION'
        })
      })
  }
}