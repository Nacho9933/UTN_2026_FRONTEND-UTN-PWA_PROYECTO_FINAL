import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { LandingScreen } from './Screens/LandingScreen/LandingScreen'
import { LoginScreen } from './Screens/LoginScreen/LoginScreen'
import { RegisterScreen } from './Screens/RegisterScreen/RegisterScreen'
import { HomeScreen } from './Screens/HomeScreen/HomeScreen'
import { NewWorkspaceScreen } from './Screens/NewWorkspaceScreen/NewWorkspaceScreen'
import { WorkspaceDetailScreen } from './Screens/WorkspaceDetailScreen/WorkspaceDetailScreen'
import { ChannelMessagesScreen } from './Screens/ChannelMessagesScreen/ChannelMessagesScreen'
import { MembersScreen } from './Screens/MembersScreen/MembersScreen'
import { ResetPasswordScreen } from './Screens/ResetPasswordScreen/ResetPasswordScreen'
import { ForgotPasswordScreen } from './Screens/ForgotPasswordScreen/ForgotPasswordScreen'
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
            path='/forgot-password'
            element={<ForgotPasswordScreen />}
          />
          <Route
            path='/'
            element={<LandingScreen />}
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
          <Route
            path='/workspace/:workspace_id/members'
            element={<MembersScreen />}
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