// ** Initial State
const initialState = {
  allData: [],
  data: [],
  total: 1,
  params: null,
  selected: null,
  loading: false,
  error: null,
  success: false,
  add_status_awal_santri: null,
  update_status_awal_santri: null
}

const statusawalsantris = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA_STATUS_AWAL_SANTRI':
      return { ...state, allData: action.data, params: action.params }
    case 'GET_DATA_STATUS_AWAL_SANTRI':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_STATUS_AWAL_SANTRI':
      return { ...state, selected: action.selected }
    case 'ADD_STATUS_AWAL_SANTRI':
      return { ...state, add_status_awal_santri: action.data }
    case 'UPDATE_STATUS_AWAL_SANTRI':
      return { ...state, update_status_awal_santri: action.data }
    case 'DELETE_STATUS_AWAL_SANTRI':
      return { ...state }
    case 'RESET_STATUS_AWAL_SANTRI':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_STATUS_AWAL_SANTRI':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_STATUS_AWAL_SANTRI':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_STATUS_AWAL_SANTRI':
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return { ...state }
  }
}
export default statusawalsantris
