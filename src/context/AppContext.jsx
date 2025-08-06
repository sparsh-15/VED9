import { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  cart: [],
  wishlist: [],
  user: null,
  isLoginModalOpen: false
}

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      }

    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }

    case 'ADD_TO_WISHLIST':
      if (state.wishlist.find(item => item.id === action.payload.id)) {
        return state
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      }

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload)
      }

    case 'TOGGLE_LOGIN_MODAL':
      return {
        ...state,
        isLoginModalOpen: !state.isLoginModalOpen
      }

    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
  }

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: productId, quantity } })
    }
  }

  const addToWishlist = (product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product })
  }

  const removeFromWishlist = (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId })
  }

  const toggleLoginModal = () => {
    dispatch({ type: 'TOGGLE_LOGIN_MODAL' })
  }

  const getTotalPrice = () => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return state.cart.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    addToWishlist,
    removeFromWishlist,
    toggleLoginModal,
    getTotalPrice,
    getTotalItems
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}