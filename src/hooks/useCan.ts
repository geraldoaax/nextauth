import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

type UseCanParams = {
  permissions?: string[]
  roles?: string[]
}

export function useCan({ permissions, roles }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated) {
    return false
  }

  if (permissions?.length > 0) {
    //every retorna true se tudo atende
    const hasAllPermissions = permissions?.every(permission => {
      return user.permissions.includes(permission)
    })
    if (!hasAllPermissions) {
      return false
    }
  }

  if (roles?.length > 0) {
    //every retorna true se tudo atende
    //some retorna true se tem alguma que atende
    const hasAllroles = roles?.some(role => {
      return user.roles.includes(role)
    })
    if (!hasAllroles) {
      return false
    }
  }

  return true

}
