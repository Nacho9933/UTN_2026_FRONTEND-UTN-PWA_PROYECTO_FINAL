import React from 'react'
import { Navigate, useSearchParams } from 'react-router'

export const ResetPasswordScreen = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const reset_password_token = searchParams.get('reset_password_token')
    if(!reset_password_token){
        return <Navigate to={'/login'}/>
    }
  return (
    <div>
        <h1>Restablecer contraseña</h1>
        <form>

        </form>
    </div>
  )
}
