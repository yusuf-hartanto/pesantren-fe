import axios from 'axios'

// ** Get data on page or row change
export const getDataHasilCekFakta = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/report/factcheck`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_HASIL_CEK_FAKTA',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_HASIL_CEK_FAKTA',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getHasilCekFakta = value => {
  return async dispatch => {
    dispatch({
      type: 'GET_HASIL_CEK_FAKTA',
      selected: value
    })
  }
}

// ** Add new HasilCekFakta
export const addHasilCekFakta = params => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_HASIL_CEK_FAKTA'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/report/factcheck`, params, {
        onUploadProgress: progressEvent => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          dispatch({
            type: 'PROGRESS_HASIL_CEK_FAKTA',
            progress
          })
        }
      })
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_HASIL_CEK_FAKTA',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_HASIL_CEK_FAKTA'
          })
        } else {
          dispatch({
            type: 'ERROR_HASIL_CEK_FAKTA',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_HASIL_CEK_FAKTA',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_HASIL_CEK_FAKTA',
            error: err.message
          })
        }
      })
      .finally(() => {
        dispatch({
          type: 'PROGRESS_HASIL_CEK_FAKTA',
          progress: null
        })
        dispatch({
          type: 'RESET_HASIL_CEK_FAKTA'
        })
      })
  }
}

// ** update HasilCekFakta
export const updateHasilCekFakta = (id, params) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_HASIL_CEK_FAKTA'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/report/factcheck/${id}`, params, {
        onUploadProgress: progressEvent => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          dispatch({
            type: 'PROGRESS_HASIL_CEK_FAKTA',
            progress
          })
        }
      })
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_HASIL_CEK_FAKTA',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_HASIL_CEK_FAKTA'
          })
        } else {
          dispatch({
            type: 'ERROR_HASIL_CEK_FAKTA',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_HASIL_CEK_FAKTA',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_HASIL_CEK_FAKTA',
            error: err.message
          })
        }
      }).finally(() => {
        dispatch({
          type: 'PROGRESS_HASIL_CEK_FAKTA',
          progress: null
        })
        dispatch({
          type: 'RESET_HASIL_CEK_FAKTA'
        })
      })
  }
}

// ** Delete
export const deleteHasilCekFakta = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/report/factcheck/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_HASIL_CEK_FAKTA'
        })
      })
      .finally(() => {
        dispatch(getDataHasilCekFakta(getState().hasilcekfaktas.params))
      })
      .catch(err => console.log(err))
  }
}