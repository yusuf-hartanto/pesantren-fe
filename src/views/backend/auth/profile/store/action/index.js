import axios from 'axios'

// ** Get Profile
export const getProfile = user => {
  return async dispatch => {
    dispatch({
      type: 'GET_PROFILE',
      selected: user
    })
  }
}

// ** Get Data Profile
export const getDataProfile = id => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/resource/${id}`).then(response => {

      const {data} = response

      if (data.status) {
        dispatch(getProfile(data.data))
      }
    })
  }
}

// ** update user
export const updateProfile = (id, user) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_PROFILE'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/app/resource/${id}`, user)
      .then(response => {

        const {data} = response

        if (data.status) {

          dispatch(getProfile(data.data))

          dispatch({
            type: 'SUCCESS_PROFILE'
          })
        } else {
          dispatch({
            type: 'ERROR_PROFILE',
            error: data.message
          })
        }
      })
      .catch(err => {
        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_PROFILE',
            error: data.message
          })
        } else if (response?.status === 400) {
          const {data} = response
          dispatch({
            type: 'ERROR_PROFILE',
            error: data.message
          })
        } else if (response?.status === 404) {
          const {data} = response
          dispatch({
            type: 'ERROR_PROFILE',
            error: data.message
          })
        }
      })
      .then(() => {
        dispatch({
          type: 'RESET_PROFILE'
        })
      })
  }
}

