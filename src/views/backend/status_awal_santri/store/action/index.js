import axios from 'axios'

// ** Get all Data
export const getAllDataStatusAwalSantri = (params) => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/status-awal-santri/all-data`, {params}).then(response => {

      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_STATUS_AWAL_SANTRI',
          data: data.data,
          params
        })
      }
    }).catch(err => {
      const {response} = err
      if (response.status === 404) {
        dispatch({
          type: 'GET_ALL_DATA_STATUS_AWAL_SANTRI',
          data: [],
          params
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getDataStatusAwalSantri = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/status-awal-santri`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_STATUS_AWAL_SANTRI',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_STATUS_AWAL_SANTRI',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get Status Awal Santri
export const getStatusAwalSantri = StatusAwalSantri => {
  return async dispatch => {
    dispatch({
      type: 'GET_STATUS_AWAL_SANTRI',
      selected: StatusAwalSantri
    })
  }
}

// ** Add new Status Awal Santri
export const addStatusAwalSantri = StatusAwalSantri => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_STATUS_AWAL_SANTRI'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/app/status-awal-santri`, StatusAwalSantri)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_STATUS_AWAL_SANTRI',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_STATUS_AWAL_SANTRI'
          })
        } else {
          dispatch({
            type: 'ERROR_STATUS_AWAL_SANTRI',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_STATUS_AWAL_SANTRI',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_STATUS_AWAL_SANTRI',
            error: err.message
          })
        }
      })
      .then(() => {
        dispatch({
          type: 'RESET_STATUS_AWAL_SANTRI'
        })
      })
  }
}

// ** update Status Awal Santri
export const updateStatusAwalSantri = (id, StatusAwalSantri) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_STATUS_AWAL_SANTRI'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/app/status-awal-santri/${id}`, StatusAwalSantri)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_STATUS_AWAL_SANTRI',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_STATUS_AWAL_SANTRI'
          })
        } else {
          dispatch({
            type: 'ERROR_STATUS_AWAL_SANTRI',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_STATUS_AWAL_SANTRI',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_STATUS_AWAL_SANTRI',
            error: err.message
          })
        }
      }).then(() => {
        dispatch({
          type: 'RESET_STATUS_AWAL_SANTRI'
        })
      })
  }
}

// ** Delete Status Awal Santri
export const deleteStatusAwalSantri = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/app/status-awal-santri/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_STATUS_AWAL_SANTRI'
        })
      })
      .then(() => {
        dispatch(getDataStatusAwalSantri(getState().statusawalsantris.params))
      })
      .catch(err => console.log(err))
  }
}

