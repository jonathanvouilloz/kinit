// Action Types
export const ADD_CAMP = 'ADD_CAMP'
export const ADD_TRANSA = 'ADD_TRANSA'
export const ADD_ALL_TRANSA = 'ADD_ALL_TRANSA'
export const ADD_TRANSA_FIRST = 'ADD_TRANSA_FIRST'
export const RESET = 'RESET'
// Action Creators

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
  }
}

export function addalltransa(allTransa) {
  return {
    type: ADD_ALL_TRANSA,
    allTransa,
  }
}

export function addtransafirst(transa) {
  return {
    type: ADD_TRANSA_FIRST,
    transa,
  }
}

export function reset() {
  return {
    type: RESET,
  }
}

// reducer

const initialState = {camp:{}, transactions:[]}

function campsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_CAMP:
      return {
        camp:{
          id: action.camp.id,
          name: action.camp.name,
          solde: action.camp.solde,
          soldeInitial: action.camp.soldeInitial,
          caution: action.camp.caution,
        },
        transactions: [...state.transactions]
      }

      case ADD_TRANSA_FIRST:
      return {
        ...state,
        transactions: [action.transa]
      }

      case ADD_TRANSA:
        return {
          ...state,
          transactions: [action.transa, ...state.transactions]
        }

      case ADD_ALL_TRANSA:
      return {
        ...state,
        transactions: action.allTransa,
      }

      case RESET:
      return {camp:{}, transactions:[]}

    default:
      return state
  }
}

export default campsReducer