type User = {
  permissions: string[]
  roles: string[]
}

type ValidateUserPermissionsParams = {
  user: User
  permissions?: string[]
  roles?: string[]
}

export function validateUserPermissions({ user, permissions, roles }: ValidateUserPermissionsParams) {

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
