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
  add_tahun_ajaran: null,
  update_tahun_ajaran: null
}

const tahunajarans = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA_TAHUN_AJARAN':
      return { ...state, allData: action.data, params: action.params }
    case 'GET_DATA_TAHUN_AJARAN':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_TAHUN_AJARAN':
      return { ...state, selected: action.selected }
    case 'ADD_TAHUN_AJARAN':
      return { ...state, add_tahun_ajaran: action.data }
    case 'UPDATE_TAHUN_AJARAN':
      return { ...state, update_tahun_ajaran: action.data }
    case 'DELETE_TAHUN_AJARAN':
      return { ...state }
    case 'RESET_TAHUN_AJARAN':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_TAHUN_AJARAN':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_TAHUN_AJARAN':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_TAHUN_AJARAN':
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return { ...state }
  }
}
export default tahunajarans
