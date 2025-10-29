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
    case 'GET_ALL_DATA_BAWASLU_UPDATE':
      return { ...state, allData: action.data, params: action.params }
    case 'GET_DATA_BAWASLU_UPDATE':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_BAWASLU_UPDATE':
      return { ...state, selected: action.selected }
    case 'ADD_BAWASLU_UPDATE':
      return { ...state, add: action.data }
    case 'UPDATE_BAWASLU_UPDATE':
      return { ...state, update: action.data }
    case 'DELETE_BAWASLU_UPDATE':
      return { ...state }
    case 'RESET_BAWASLU_UPDATE':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_BAWASLU_UPDATE':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_BAWASLU_UPDATE':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_BAWASLU_UPDATE':
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case 'PROGRESS_BAWASLU_UPDATE':
      return {
        ...state,
        progress: action.progress
      }
    default:
      return { ...state }
  }
}
export default reducers
