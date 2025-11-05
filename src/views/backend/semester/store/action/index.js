import axios from 'axios'

// ** Get all Data
export const getAllDataSemester = (params) => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/semester/all-data`, {params}).then(response => {

      const {data} = response

      if (data.status) {
        dispatch({
          type: 'GET_ALL_DATA_SEMESTER',
          data: data.data,
          params
        })
      }
    }).catch(err => {
      const {response} = err
      if (response.status === 404) {
        dispatch({
          type: 'GET_ALL_DATA_SEMESTER',
          data: [],
          params
        })
      }
    })
  }
}

// ** Get data on page or row change
export const getDataSemester = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/app/semester`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_SEMESTER',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_SEMESTER',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get Tahun Angkatan
export const getSemester = Semester => {
  return async dispatch => {
    dispatch({
      type: 'GET_SEMESTER',
      selected: Semester
    })
  }
}

// ** Add new Tahun Angkatan
export const addSemester = Semester => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_SEMESTER'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/app/semester`, Semester)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_SEMESTER',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_SEMESTER'
          })
        } else {
          dispatch({
            type: 'ERROR_SEMESTER',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_SEMESTER',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_SEMESTER',
            error: err.message
          })
        }
      })
      .then(() => {
        dispatch({
          type: 'RESET_SEMESTER'
        })
      })
  }
}

// ** update Tahun Angkatan
export const updateSemester = (id, Semester) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_SEMESTER'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/app/semester/${id}`, Semester)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_SEMESTER',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_SEMESTER'
          })
        } else {
          dispatch({
            type: 'ERROR_SEMESTER',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_SEMESTER',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_SEMESTER',
            error: err.message
          })
        }
      }).then(() => {
        dispatch({
          type: 'RESET_SEMESTER'
        })
      })
  }
}

// ** Delete Tahun Angkatan
export const deleteSemester = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/app/semester/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_SEMESTER'
        })
      })
      .then(() => {
        dispatch(getDataSemester(getState().semesters.params))
      })
      .catch(err => console.log(err))
  }
}

