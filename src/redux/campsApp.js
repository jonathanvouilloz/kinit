// import the dependency
import remove from 'lodash.remove'


// Action Types
export const ADD_CAMP = 'ADD_CAMP'
export const ADD_TRANSA = 'ADD_TRANSA'


// Action Creators

let campID = 0

export function addcamp(camp) {
  return {
    type: ADD_CAMP,
    camp
  }
}

export function addtransa(transa) {
  return {
    type: ADD_TRANSA,
    transa,
    id: transa.name+campID++
  }
}

// reducer

const initialState = {}

function campsReducer(state = initialState, action) {
  console.log("___");
  switch (action.type) {
    case ADD_CAMP:
      return {
            name: action.camp.name,
            solde: action.camp.solde,
      }

    case ADD_TRANSA:
      return {
        ...state,
        transactions:{
          ...state.transactions,
          [action.id]: action.transa,
        }   
      }


    default:
      return state
  }
}

export default campsReducer