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
  add_tingkat: null,
  update_tingkat: null
}

const tahunangkatans = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA_TINGKAT':
      return { ...state, allData: action.data, params: action.params }
    case 'GET_DATA_TINGKAT':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_TINGKAT':
      return { ...state, selected: action.selected }
    case 'ADD_TINGKAT':
      return { ...state, add_tingkat: action.data }
    case 'UPDATE_TINGKAT':
      return { ...state, update_tingkat: action.data }
    case 'DELETE_TINGKAT':
      return { ...state }
    case 'RESET_TINGKAT':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_TINGKAT':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_TINGKAT':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_TINGKAT':
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return { ...state }
  }
}
export default tahunangkatans
