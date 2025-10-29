import axios from 'axios'

// ** Get data on page or row change
export const getDataReportArticle = params => {
  return async dispatch => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/report/article`, {params})
      .then(response => {
        const {data} = response

        if (data.status) {

          dispatch({
            type: 'GET_DATA_REPORT_ARTICLE',
            data: data.data.values,
            totalPages: data.data.total,
            params
          })
        }
      }).catch(err => {
        const {response} = err
        if (response.status === 404) {
          dispatch({
            type: 'GET_DATA_REPORT_ARTICLE',
            data: [],
            totalPages: 0,
            params
          })
        }
      })
  }
}

// ** Get
export const getReportArticle = value => {
  return async dispatch => {
    dispatch({
      type: 'GET_REPORT_ARTICLE',
      selected: value
    })
  }
}

// ** Add new ReportArticle
export const addReportArticle = params => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_REPORT_ARTICLE'
    })

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/report/article`, params)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'ADD_REPORT_ARTICLE',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_REPORT_ARTICLE'
          })
        } else {
          dispatch({
            type: 'ERROR_REPORT_ARTICLE',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_REPORT_ARTICLE',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_REPORT_ARTICLE',
            error: err.message
          })
        }
      })
      .finally(() => {
        dispatch({
          type: 'RESET_REPORT_ARTICLE'
        })
      })
  }
}

// ** update ReportArticle
export const updateReportArticle = (id, params) => {
  return (dispatch, getState) => {

    dispatch({
      type: 'REQUEST_REPORT_ARTICLE'
    })

    axios
      .put(`${process.env.REACT_APP_BASE_URL}/report/article/${id}`, params)
      .then(response => {
        const {data} = response

        if (data.status) {
          dispatch({
            type: 'UPDATE_REPORT_ARTICLE',
            data: data.data
          })
          dispatch({
            type: 'SUCCESS_REPORT_ARTICLE'
          })
        } else {
          dispatch({
            type: 'ERROR_REPORT_ARTICLE',
            error: data.message
          })
        }
      })
      .catch(err => {

        const {response} = err
        
        if (response?.status === 422) {
          const {data} = response
          dispatch({
            type: 'ERROR_REPORT_ARTICLE',
            error: data.message
          })
        } else {
          dispatch({
            type: 'ERROR_REPORT_ARTICLE',
            error: err.message
          })
        }
      }).finally(() => {
        dispatch({
          type: 'RESET_REPORT_ARTICLE'
        })
      })
  }
}

// ** Delete
export const deleteReportArticle = id => {
  return (dispatch, getState) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/report/article/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_REPORT_ARTICLE'
        })
      })
      .finally(() => {
        dispatch(getDataReportArticle(getState().reportarticles.params))
      })
      .catch(err => console.log(err))
  }
}