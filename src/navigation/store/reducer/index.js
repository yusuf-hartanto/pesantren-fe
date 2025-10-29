// ** Initial State
const initialState = {
  allData: []
}

const navigations = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA_NAVIGATION':
      return { ...state, allData: action.data }
    default:
      return { ...state }
  }
}
export default navigations
