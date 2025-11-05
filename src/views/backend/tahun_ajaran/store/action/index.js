import axios from 'axios'

// ** Get all Data
export const getAllDataTahunAjaran = (params) => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/tahun-ajaran/all-data`, {params}).then(response => {

      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_TAHUN_AJARAN',
          data: data.data,
          params
        })
      }
    }).catch(err => {
      const {response} = err
      if (response.status === 404) {
        dispatch({
          type: 'GET_ALL_DATA_TAHUN_AJARAN',
          data: [],
          params
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getDataTahunAjaran = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/tahun-ajaran`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_TAHUN_AJARAN',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_TAHUN_AJARAN',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get Tahun Angkatan
export const getTahunAjaran = TahunAjaran => {
  return async dispatch => {
    dispatch({
      type: 'GET_TAHUN_AJARAN',
      selected: TahunAjaran
    })
  }
}

// ** Add new Tahun Angkatan
export const addTahunAjaran = TahunAjaran => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_TAHUN_AJARAN'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/app/tahun-ajaran`, TahunAjaran)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_TAHUN_AJARAN',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_TAHUN_AJARAN'
          })
        } else {
          dispatch({
            type: 'ERROR_TAHUN_AJARAN',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_TAHUN_AJARAN',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_TAHUN_AJARAN',
            error: err.message
          })
        }
      })
      .then(() => {
        dispatch({
          type: 'RESET_TAHUN_AJARAN'
        })
      })
  }
}

// ** update Tahun Angkatan
export const updateTahunAjaran = (id, TahunAjaran) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_TAHUN_AJARAN'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/app/tahun-ajaran/${id}`, TahunAjaran)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_TAHUN_AJARAN',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_TAHUN_AJARAN'
          })
        } else {
          dispatch({
            type: 'ERROR_TAHUN_AJARAN',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_TAHUN_AJARAN',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_TAHUN_AJARAN',
            error: err.message
          })
        }
      }).then(() => {
        dispatch({
          type: 'RESET_TAHUN_AJARAN'
        })
      })
  }
}

// ** Delete Tahun Angkatan
export const deleteTahunAjaran = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/app/tahun-ajaran/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_TAHUN_AJARAN'
        })
      })
      .then(() => {
        dispatch(getDataTahunAjaran(getState().tahunajarans.params))
      })
      .catch(err => console.log(err))
  }
}

