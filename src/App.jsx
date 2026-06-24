import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { LoginScreen } from './Screens/LoginScreen/LoginScreen'
import { RegisterScreen } from './Screens/RegisterScreen/RegisterScreen'
import { HomeScreen } from './Screens/HomeScreen/HomeScreen'
import { NewWorkspaceScreen } from './Screens/NewWorkspaceScreen/NewWorkspaceScreen'
import { WorkspaceDetailScreen } from './Screens/WorkspaceDetailScreen/WorkspaceDetailScreen'
import { ChannelMessagesScreen } from './Screens/ChannelMessagesScreen/ChannelMessagesScreen'
import { ResetPasswordScreen } from './Screens/ResetPasswordScreen/ResetPasswordScreen'
import { AuthContextProvider } from './context/AuthContext'
import { WorkspacesContextProvider } from './context/WorkspacesContext'
import AuthMiddleware from './middlewares/AuthMiddleware'
import AlreadyAuthMiddleware from './middlewares/AlreadyAuthMiddleware'


const App = () => {
  return (
    <AuthContextProvider>
      <Routes>

        <Route element={<AlreadyAuthMiddleware />}>
          <Route
            path='/login'
            element={<LoginScreen />}
          />
          <Route
            path='/register'
            element={<RegisterScreen />}
          />
          <Route
            path='/reset-password'
            element={<ResetPasswordScreen />}
          />
          <Route
            path='/'
            element={<LoginScreen />}
          />
        </Route>

        <Route
          element={<AuthMiddleware />}
        >
          <Route element={<WorkspacesContextProvider />}>
            <Route
              path='/home'
              element={<HomeScreen />}
            />
            <Route
              path='/workspace/new'
              element={<NewWorkspaceScreen />}
            />
          </Route>
          <Route
            path='/workspace/:workspace_id'
            element={<WorkspaceDetailScreen />}
          />
          <Route
            path='/workspace/:workspace_id/channels/:channel_id'
            element={<ChannelMessagesScreen />}
          />
        </Route>

        <Route
          path='/*'
          element={<Navigate to={'/home'} />}
        />

      </Routes>
    </AuthContextProvider>
  )
}

export default App