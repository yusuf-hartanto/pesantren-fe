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
  add_tahun_angkatan: null,
  update_tahun_angkatan: null
}

const tahunangkatans = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA_TAHUN_ANGKATAN':
      return { ...state, allData: action.data, params: action.params }
    case 'GET_DATA_TAHUN_ANGKATAN':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_TAHUN_ANGKATAN':
      return { ...state, selected: action.selected }
    case 'ADD_TAHUN_ANGKATAN':
      return { ...state, add_tahun_angkatan: action.data }
    case 'UPDATE_TAHUN_ANGKATAN':
      return { ...state, update_tahun_angkatan: action.data }
    case 'DELETE_TAHUN_ANGKATAN':
      return { ...state }
    case 'RESET_TAHUN_ANGKATAN':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_TAHUN_ANGKATAN':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_TAHUN_ANGKATAN':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_TAHUN_ANGKATAN':
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
