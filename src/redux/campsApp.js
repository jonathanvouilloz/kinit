// import the dependency
import remove from 'lodash.remove'


// Action Types
export const ADD_CAMP = 'ADD_CAMP'
export const DEL_CAMP = 'DEL_CAMP'


// Action Creators

let campID = 0

export function addcamp(camp) {
  return {
    type: ADD_CAMP,
    id: campID++,
    camp
  }
}

export function delcamp(id) {
  return {
    type: DEL_CAMP,
    payload: id
  }
}

// reducer

const initialState = []

function campsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_CAMP:
      return [
        ...state,
        {
          id: action.id,
          camp: action.camp
        }
      ]

    case DEL_CAMP:
      const deletedNewArray = remove(state, obj => {
        return obj.id != action.payload
      })
      return deletedNewArray

    default:
      return state
  }
}

export default campsReducer