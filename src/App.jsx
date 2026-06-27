import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { LandingScreen } from './Screens/LandingScreen/LandingScreen'
import { LoginScreen } from './Screens/LoginScreen/LoginScreen'
import { RegisterScreen } from './Screens/RegisterScreen/RegisterScreen'
import { HomeScreen } from './Screens/HomeScreen/HomeScreen'
import { NewWorkspaceScreen } from './Screens/NewWorkspaceScreen/NewWorkspaceScreen'
import { ChatLayout, ChatEmpty } from './Screens/ChatLayout/ChatLayout'
import { MessagesPanel } from './components/chat/MessagesPanel/MessagesPanel'
import { MembersPanel } from './components/chat/MembersPanel/MembersPanel'
import { DMPanel } from './components/chat/DMPanel/DMPanel'
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
          <Route path='/workspace/:workspace_id' element={<ChatLayout />}>
            <Route index element={<ChatEmpty />} />
            <Route path='channels/:channel_id' element={<MessagesPanel />} />
            <Route path='dm/:user_id' element={<DMPanel />} />
            <Route path='members' element={<MembersPanel />} />
          </Route>
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