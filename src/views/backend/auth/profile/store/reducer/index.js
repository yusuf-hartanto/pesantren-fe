// ** Initial State
const initialState = {
  selected: null,
  loading: false,
  error: null,
  success: false
}

const profile = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PROFILE':
      return { ...state, selected: action.selected }
    case 'RESET_PROFILE':
      return {
        ...state,
        loading: false,
        error: null,
        success: false
      }
    case 'REQUEST_PROFILE':
      return {
        ...state,
        loading: true
      }
    case 'SUCCESS_PROFILE':
      return {
        ...state,
        loading: false,
        success: true
      }
    case 'ERROR_PROFILE':
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return { ...state }
  }
}
export default profile
