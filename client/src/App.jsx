import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import SideBar from './components/shared/SideBar'
import { useSelector } from 'react-redux'
import { privateRoutes, publicRoutes } from './routes'
import Login from './pages/Login'
import './index.css'
import SessionExpiredModal from './components/Modals/SessionExpiredModal'
import { ToastContainer } from 'react-toastify'

const App = () => {
  const userExists = useSelector(state => state.auth?.accessToken)
  const session = useSelector(state => state.session.isExpired)

  {
    !session && (
      <Navigate
        to={
          <>
            <Login />
          </>
        }
      />
    )
  }
  return (
    <>
      <Router>
        <Routes>
          {privateRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                userExists ? (
                  session ? (
                    <SessionExpiredModal openSessionExpired={session} />
                  ) : (
                    <div className="flex">
                      <SideBar />
                      <Component />
                      <ToastContainer />
                    </div>
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          ))}
          {publicRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                !userExists ? (
                  <>
                    <Component />
                    <ToastContainer />
                  </>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          ))}
          <Route
            path="/login"
            element={
              userExists ? (
                <Navigate to="/" />
              ) : (
                <>
                  <Login />
                </>
              )
            }
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
