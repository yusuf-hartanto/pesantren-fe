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
  add: null,
  update: null,
  progress: null
}

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA_HASIL_CEK_FAKTA':
      return { ...state, allData: action.data, params: action.params }
    case 'GET_DATA_HASIL_CEK_FAKTA':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_HASIL_CEK_FAKTA':
      return { ...state, selected: action.selected }
    case 'ADD_HASIL_CEK_FAKTA':
      return { ...state, add: action.data }
    case 'UPDATE_HASIL_CEK_FAKTA':
      return { ...state, update: action.data }
    case 'DELETE_HASIL_CEK_FAKTA':
      return { ...state }
    case 'RESET_HASIL_CEK_FAKTA':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_HASIL_CEK_FAKTA':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_HASIL_CEK_FAKTA':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_HASIL_CEK_FAKTA':
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case 'PROGRESS_HASIL_CEK_FAKTA':
      return {
        ...state,
        progress: action.progress
      }
    default:
      return { ...state }
  }
}
export default reducers
