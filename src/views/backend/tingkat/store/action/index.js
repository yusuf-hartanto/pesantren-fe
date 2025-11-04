import axios from 'axios'

// ** Get all Data
export const getAllDataTingkat = (params) => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/tingkat/all-data`, {params}).then(response => {

      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_TINGKAT',
          data: data.data,
          params
        })
      }
    }).catch(err => {
      const {response} = err
      if (response.status === 404) {
        dispatch({
          type: 'GET_ALL_DATA_TINGKAT',
          data: [],
          params
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getDataTingkat = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/tingkat`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_TINGKAT',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_TINGKAT',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get Tingkat
export const getTingkat = Tingkat => {
  return async dispatch => {
    dispatch({
      type: 'GET_TINGKAT',
      selected: Tingkat
    })
  }
}

// ** Add new Tingkat
export const addTingkat = Tingkat => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_TINGKAT'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/app/tingkat`, Tingkat)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_TINGKAT',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_TINGKAT'
          })
        } else {
          dispatch({
            type: 'ERROR_TINGKAT',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_TINGKAT',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_TINGKAT',
            error: err.message
          })
        }
      })
      .then(() => {
        dispatch({
          type: 'RESET_TINGKAT'
        })
      })
  }
}

// ** update Tingkat
export const updateTingkat = (id, Tingkat) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_TINGKAT'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/app/tingkat/${id}`, Tingkat)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_TINGKAT',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_TINGKAT'
          })
        } else {
          dispatch({
            type: 'ERROR_TINGKAT',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_TINGKAT',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_TINGKAT',
            error: err.message
          })
        }
      }).then(() => {
        dispatch({
          type: 'RESET_TINGKAT'
        })
      })
  }
}

// ** Delete Tingkat
export const deleteTingkat = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/app/tingkat/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_TINGKAT'
        })
      })
      .then(() => {
        dispatch(getDataTingkat(getState().tingkats.params))
      })
      .catch(err => console.log(err))
  }
}

