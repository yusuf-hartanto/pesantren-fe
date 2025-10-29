import axios from 'axios'

// ** Get all Data
export const getAllData = () => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/resource/all-data`).then(response => {
      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_USER',
          data: data.data
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getData = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/resource`, {params})
      .then(response => {
        const {data} = response
        
        if (data.status) {

          dispatch({
            type: 'GET_DATA_USER',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_USER',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get User
export const getUser = user => {
  return async dispatch => {
    dispatch({
      type: 'GET_USER',
      selected: user
    })
  }
}

// ** Add new user
export const addUser = user => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_USER'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/app/resource`, user)
      .then(response => {

        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_USER',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_USER'
          })
        } else {
          dispatch({
            type: 'ERROR_USER',
            error: data.message
          })
        }
      })
      .catch(err => {
        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_USER',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_USER',
            error: err.message
          })
        }
      })
      .then(() => {
        dispatch({
          type: 'RESET_USER'
        })
      })
  }
}

// ** update user
export const updateUser = (id, user) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_USER'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/app/resource/${id}`, user)
      .then(response => {

        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_USER',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_USER'
          })
        } else {
          dispatch({
            type: 'ERROR_USER',
            error: data.message
          })
        }
      })
      .catch(err => {
        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_USER',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_USER',
            error: err.message
          })
        }
      })
      .then(() => {
        dispatch({
          type: 'RESET_USER'
        })
      })
  }
}

// ** Delete user
export const deleteUser = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/app/resource/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_USER'
        })
      })
      .then(() => {
        dispatch(getData(getState().users.params))
      })
      .catch(err => console.log(err))
  }
}

// ** Add check username
export const checkUserUsername = value => {
  return (dispatch, getState) => {

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/app/resource/check/${value}`)
      .then(response => {

        const {data} = response

        dispatch({
          type: 'GET_USER_CHECK_USERNAME',
          check_username: data
        })
      })
      .catch(err => {
        const {response} = err
        
        if (response?.status === 400) {
          const {data} = response
          dispatch({
            type: 'GET_USER_CHECK_USERNAME',
            check_username: data
          })
        }
      }).then(() => {
        dispatch({
          type: 'GET_USER_CHECK_USERNAME',
          check_username: null
        })
      })
  }
}

// ** Add get province
export const getProvince = (cb = null) => {
  return (dispatch, getState) => {

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/area/province`)
      .then(response => {

        const {data} = response

        if (cb) {
          cb(data)
        }
      })
  }
}

// ** Add get regency
export const getRegency = (provinceid, cb = null) => {
  return (dispatch, getState) => {

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/area/regency/${provinceid}`)
      .then(response => {

        const {data} = response

        if (cb) {
          cb(data)
        }
      })
  }
}
