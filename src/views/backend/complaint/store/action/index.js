import axios from 'axios'

// ** Get data on page or row change
export const getDataComplaint = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/report/complaint`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_COMPLAINT',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_COMPLAINT',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getComplaint = value => {
  return async dispatch => {
    dispatch({
      type: 'GET_COMPLAINT',
      selected: value
    })
  }
}

// ** Add new Complaint
export const addComplaint = params => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_COMPLAINT'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/report/complaint`, params)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_COMPLAINT',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_COMPLAINT'
          })
        } else {
          dispatch({
            type: 'ERROR_COMPLAINT',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_COMPLAINT',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_COMPLAINT',
            error: err.message
          })
        }
      })
      .finally(() => {
        dispatch({
          type: 'RESET_COMPLAINT'
        })
      })
  }
}

// ** update Complaint
export const updateComplaint = (id, params) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_COMPLAINT'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/report/complaint/${id}`, params)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_COMPLAINT',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_COMPLAINT'
          })
        } else {
          dispatch({
            type: 'ERROR_COMPLAINT',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_COMPLAINT',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_COMPLAINT',
            error: err.message
          })
        }
      }).finally(() => {
        dispatch({
          type: 'RESET_COMPLAINT'
        })
      })
  }
}

// ** Delete
export const deleteComplaint = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/report/complaint/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_COMPLAINT'
        })
      })
      .finally(() => {
        dispatch(getDataComplaint(getState().complaints.params))
      })
      .catch(err => console.log(err))
  }
}