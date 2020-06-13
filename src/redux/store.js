import { createStore } from 'redux'
import campsReducer from './campsApp'

const store = createStore(campsReducer)

export default store