import axios from 'axios'

// ** Get all Data
export const getAllDataGlobalParam = (params) => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/param-global/all-data`, {params}).then(response => {

      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_GLOBAL_PARAM',
          data: data.data,
          params
        })
      }
    }).catch(err => {
      const {response} = err
      if (response.status === 404) {
        dispatch({
          type: 'GET_ALL_DATA_GLOBAL_PARAM',
          data: [],
          params
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getDataGlobalParam = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/param-global`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_GLOBAL_PARAM',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_GLOBAL_PARAM',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get global
export const getGlobalParam = globalparam => {
  return async dispatch => {
    dispatch({
      type: 'GET_GLOBAL_PARAM',
      selected: globalparam
    })
  }
}

// ** Add new globalparam
export const addGlobalParam = globalparam => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_GLOBAL_PARAM'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/app/param-global`, globalparam)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_GLOBAL_PARAM',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_GLOBAL_PARAM'
          })
        } else {
          dispatch({
            type: 'ERROR_GLOBAL_PARAM',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_GLOBAL_PARAM',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_GLOBAL_PARAM',
            error: err.message
          })
        }
      })
      .then(() => {
        dispatch({
          type: 'RESET_GLOBAL_PARAM'
        })
      })
  }
}

// ** update globalparam
export const updateGlobalParam = (id, globalparam) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_GLOBAL_PARAM'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/app/param-global/${id}`, globalparam)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_GLOBAL_PARAM',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_GLOBAL_PARAM'
          })
        } else {
          dispatch({
            type: 'ERROR_GLOBAL_PARAM',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_GLOBAL_PARAM',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_GLOBAL_PARAM',
            error: err.message
          })
        }
      }).then(() => {
        dispatch({
          type: 'RESET_GLOBAL_PARAM'
        })
      })
  }
}

// ** Delete global
export const deleteGlobalParam = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/app/param-global/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_GLOBAL_PARAM'
        })
      })
      .then(() => {
        dispatch(getDataGlobalParam(getState().globalparams.params))
      })
      .catch(err => console.log(err))
  }
}

// ** Upload image
export const uploadImage = upload => {
  return (dispatch, getState) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/app/param-global/upload`, upload, {
        onUploadProgress: progressEvent => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          dispatch({
            type: 'PROGRESS_GLOBAL_PARAM',
            progress
          })
        }
      })
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPLOAD_GLOBAL_PARAM',
            upload: data.data
          })

          dispatch({
            type: 'PROGRESS_GLOBAL_PARAM',
            progress: null
          })
        }
      })
      .then(() => {
        dispatch({
          type: 'UPLOAD_GLOBAL_PARAM',
          upload: null
        })

        dispatch({
          type: 'PROGRESS_GLOBAL_PARAM',
          progress: null
        })
      })
      .catch(err => console.log(err))
  }
}

// ** Get data email by username
export const getEmailByUsername = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/get-email`, {params})
      .then(response => {
        const {data} = response
        if (data.status) {
          dispatch({
            type: 'GET_EMAIL_GLOBAL_PARAM',
            email: data.data
          })
        }
      })
  }
}

// ** Get kode by table
export const getKodeByTable = params => {
  return async dispatch => {
    await axios.post(`${process.env.REACT_APP_BASE_URL}/next-code`, params)
      .then(response => {
        const {data} = response
        if (data.status) {
          dispatch({
            type: 'GET_KODE_GLOBAL_PARAM',
            kode: data.data,
            params
          })
        }
      }).then(() => {
        dispatch({
          type: 'GET_KODE_GLOBAL_PARAM',
          kode: null,
          params
        })
      })
  }
}

// ** Check name by table
export const checkNameByTable = params => {
  return async dispatch => {
    await axios.post(`${process.env.REACT_APP_BASE_URL}/sgs-check`, params)
      .then(response => {
        const {data} = response
        
        dispatch({
          type: 'CHECK_NAME_GLOBAL_PARAM',
          existName: data
        })
      }).then(() => {
        dispatch({
          type: 'CHECK_NAME_GLOBAL_PARAM',
          existName: null
        })
      })
  }
}
