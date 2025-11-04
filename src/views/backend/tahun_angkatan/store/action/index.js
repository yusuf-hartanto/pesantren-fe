import axios from 'axios'

// ** Get all Data
export const getAllDataTahunAngkatan = (params) => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/tahun-angkatan/all-data`, {params}).then(response => {

      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_TAHUN_ANGKATAN',
          data: data.data,
          params
        })
      }
    }).catch(err => {
      const {response} = err
      if (response.status === 404) {
        dispatch({
          type: 'GET_ALL_DATA_TAHUN_ANGKATAN',
          data: [],
          params
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getDataTahunAngkatan = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/tahun-angkatan`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_TAHUN_ANGKATAN',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_TAHUN_ANGKATAN',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get Tahun Angkatan
export const getTahunAngkatan = TahunAngkatan => {
  return async dispatch => {
    dispatch({
      type: 'GET_TAHUN_ANGKATAN',
      selected: TahunAngkatan
    })
  }
}

// ** Add new Tahun Angkatan
export const addTahunAngkatan = TahunAngkatan => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_TAHUN_ANGKATAN'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/app/tahun-angkatan`, TahunAngkatan)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_TAHUN_ANGKATAN',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_TAHUN_ANGKATAN'
          })
        } else {
          dispatch({
            type: 'ERROR_TAHUN_ANGKATAN',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_TAHUN_ANGKATAN',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_TAHUN_ANGKATAN',
            error: err.message
          })
        }
      })
      .then(() => {
        dispatch({
          type: 'RESET_TAHUN_ANGKATAN'
        })
      })
  }
}

// ** update Tahun Angkatan
export const updateTahunAngkatan = (id, TahunAngkatan) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_TAHUN_ANGKATAN'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/app/tahun-angkatan/${id}`, TahunAngkatan)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_TAHUN_ANGKATAN',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_TAHUN_ANGKATAN'
          })
        } else {
          dispatch({
            type: 'ERROR_TAHUN_ANGKATAN',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_TAHUN_ANGKATAN',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_TAHUN_ANGKATAN',
            error: err.message
          })
        }
      }).then(() => {
        dispatch({
          type: 'RESET_TAHUN_ANGKATAN'
        })
      })
  }
}

// ** Delete Tahun Angkatan
export const deleteTahunAngkatan = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/app/tahun-angkatan/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_TAHUN_ANGKATAN'
        })
      })
      .then(() => {
        dispatch(getDataTahunAngkatan(getState().tahunangkatans.params))
      })
      .catch(err => console.log(err))
  }
}

