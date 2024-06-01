import { useSearchParams, useNavigate } from 'react-router-dom'
import { useVerifiedEmailQuery } from '../redux/slices/authApiSlice'
import { ClipLoader } from 'react-spinners'

const EmailVerifiedMessage = () => {
  const navigate = useNavigate()
  const params = useSearchParams()
  const email = params[0].get('email')
  const code = params[0].get('code')

  const { isError, isLoading } = useVerifiedEmailQuery({ email, code })
  if (!isLoading)
    return (
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex flex-col items-center justify-center  min-h-screen bg-gray-100">
          <div className="w-[40%] max-lg:w-[65%] max-sm:w-[75%] px-4 py-8 bg-white rounded-lg shadow-lg">
            {isError && (
              <h2 className="text-2xl text-center font-bold text-primary mb-4 max-sm:text-xl">
                This email is invalid or has expired
              </h2>
            )}
            {!isError && (
              <div className="w-full flex flex-col items-center">
                <div className="mb-4 text-center">
                  <h2 className="text-3xl font-bold text-primary mb-4 max-sm:text-xl">
                    Congratulations!
                  </h2>
                  <p className="text-gray-600">
                    Your email has been verified and your account has been
                    created successfully.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-[30%] max-sm:w-[70%] py-2 px-4 bg-primary text-white rounded-md hover:bg-background hover:text-primary focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  Login Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <ClipLoader size={25} />
    </div>
  )
}

export default EmailVerifiedMessage
