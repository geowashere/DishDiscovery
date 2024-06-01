import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import FindAccount from '../components/resetPassword/FindAccount'
import SecurityCode from '../components/resetPassword/SecurityCode'
import ChangePassword from '../components/resetPassword/ChangePassword'

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeSteps, setActiveSteps] = useState(1)
  const [email, setEmail] = useState('')

  if (location.state?.previousRoute !== '/login')
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="max-w-md w-full  max-sm:w-[90%] py-11 bg-white rounded-lg shadow-lg flex justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 text-xl"
          >
            goback
          </button>
        </div>
      </div>
    )

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md max-sm:w-[90%] w-full  px-4 py-2 bg-white rounded-lg shadow-lg">
        {activeSteps === 1 && (
          <FindAccount
            setActiveSteps={setActiveSteps}
            email={email}
            setEmail={setEmail}
          />
        )}
        {activeSteps === 2 && (
          <SecurityCode setActiveSteps={setActiveSteps} email={email} />
        )}
        {activeSteps === 3 && <ChangePassword email={email} />}
      </div>
    </div>
  )
}

export default ResetPassword
