import axios from 'axios'

// ** Get all Data
export const getAllDataMenu = () => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/menu/all-data`).then(response => {

      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_MENU',
          data: data.data
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getDataMenu = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/menu`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_MENU',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_MENU',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getMenu = menu => {
  return async dispatch => {
    dispatch({
      type: 'GET_MENU',
      selected: menu
    })
  }
}

// ** Add new menu
export const addMenu = menu => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_MENU'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/app/menu`, menu)
      .then(response => {

        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_MENU',
            data
          })
          dispatch({
            type: 'SUCCESS_MENU'
          })
        } else {
          dispatch({
            type: 'ERROR_MENU',
            error: data.message
          })
        }
        
      })
      .catch(err => {
        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_MENU',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_MENU',
            error: err.message
          })
        }
      })
      .then(() => {
        dispatch({
          type: 'RESET_MENU'
        })
      })
  }
}

// ** update menu
export const updateMenu = (id, menu) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_MENU'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/app/menu/${id}`, menu)
      .then(response => {

        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_MENU',
            data
          })
          dispatch({
            type: 'SUCCESS_MENU'
          })
        } else {
          dispatch({
            type: 'ERROR_MENU',
            error: data.message
          })
        }
        
      })
      .catch(err => {
        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_MENU',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_MENU',
            error: err.message
          })
        }
      })
      .then(() => {
        dispatch({
          type: 'RESET_MENU'
        })
      })
  }
}

// ** Delete menu
export const deleteMenu = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/app/menu/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_MENU'
        })
      })
      .then(() => {
        dispatch(getDataMenu(getState().menus.params))
      })
      .catch(err => console.log(err))
  }
}
