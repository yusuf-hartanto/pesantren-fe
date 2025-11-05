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
  add_beasiswa_santri: null,
  update_beasiswa_santri: null
}

const statusawalsantris = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA_BEASISWA_SANTRI':
      return { ...state, allData: action.data, params: action.params }
    case 'GET_DATA_BEASISWA_SANTRI':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_BEASISWA_SANTRI':
      return { ...state, selected: action.selected }
    case 'ADD_BEASISWA_SANTRI':
      return { ...state, add_beasiswa_santri: action.data }
    case 'UPDATE_BEASISWA_SANTRI':
      return { ...state, update_beasiswa_santri: action.data }
    case 'DELETE_BEASISWA_SANTRI':
      return { ...state }
    case 'RESET_BEASISWA_SANTRI':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_BEASISWA_SANTRI':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_BEASISWA_SANTRI':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_BEASISWA_SANTRI':
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
