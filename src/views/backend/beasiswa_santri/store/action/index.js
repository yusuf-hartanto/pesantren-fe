import axios from 'axios'

// ** Get all Data
export const getAllDataBeasiswaSantri = (params) => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/beasiswa-santri/all-data`, {params}).then(response => {

      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_BEASISWA_SANTRI',
          data: data.data,
          params
        })
      }
    }).catch(err => {
      const {response} = err
      if (response.status === 404) {
        dispatch({
          type: 'GET_ALL_DATA_BEASISWA_SANTRI',
          data: [],
          params
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getDataBeasiswaSantri = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/beasiswa-santri`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_BEASISWA_SANTRI',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_BEASISWA_SANTRI',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get Status Awal Santri
export const getBeasiswaSantri = BeasiswaSantri => {
  return async dispatch => {
    dispatch({
      type: 'GET_BEASISWA_SANTRI',
      selected: BeasiswaSantri
    })
  }
}

// ** Add new Status Awal Santri
export const addBeasiswaSantri = BeasiswaSantri => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_BEASISWA_SANTRI'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/app/beasiswa-santri`, BeasiswaSantri)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_BEASISWA_SANTRI',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_BEASISWA_SANTRI'
          })
        } else {
          dispatch({
            type: 'ERROR_BEASISWA_SANTRI',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_BEASISWA_SANTRI',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_BEASISWA_SANTRI',
            error: err.message
          })
        }
      })
      .then(() => {
        dispatch({
          type: 'RESET_BEASISWA_SANTRI'
        })
      })
  }
}

// ** update Status Awal Santri
export const updateBeasiswaSantri = (id, BeasiswaSantri) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_BEASISWA_SANTRI'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/app/beasiswa-santri/${id}`, BeasiswaSantri)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_BEASISWA_SANTRI',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_BEASISWA_SANTRI'
          })
        } else {
          dispatch({
            type: 'ERROR_BEASISWA_SANTRI',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_BEASISWA_SANTRI',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_BEASISWA_SANTRI',
            error: err.message
          })
        }
      }).then(() => {
        dispatch({
          type: 'RESET_BEASISWA_SANTRI'
        })
      })
  }
}

// ** Delete Status Awal Santri
export const deleteBeasiswaSantri = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/app/beasiswa-santri/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_BEASISWA_SANTRI'
        })
      })
      .then(() => {
        dispatch(getDataBeasiswaSantri(getState().beasiswasantris.params))
      })
      .catch(err => console.log(err))
  }
}

