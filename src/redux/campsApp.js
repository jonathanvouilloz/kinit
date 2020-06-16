// Action Types
export const ADD_CAMP = 'ADD_CAMP'
export const ADD_TRANSA = 'ADD_TRANSA'
export const ADD_ALL_TRANSA = 'ADD_ALL_TRANSA'


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

export function addalltransa(allTransa) {
  return {
    type: ADD_ALL_TRANSA,
    allTransa,
    id: allTransa.name+campID++
  }
}

// reducer

const initialState = {}

function campsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_CAMP:
      return {
            id: action.camp.id,
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

      case ADD_ALL_TRANSA:
      return {
        ...state,
        transactions:{
          [action.id]: action.allTransa,
        }   
      }
    default:
      return state
  }
}

export default campsReducer