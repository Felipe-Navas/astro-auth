import { loginUser, registerUser } from './auth'
import { logoutUser } from './auth'

export const server = {
  registerUser,
  logoutUser,
  loginUser,
}
