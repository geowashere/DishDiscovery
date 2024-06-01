import { useLocation, useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { useState, useEffect } from 'react'
import { terror } from '../utils/toasts'
import axios from 'axios'

const VerifyEmail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const email = location.state?.email

  const handleVerify = async () => {
    if (!code.trim()) {
      terror('Enter the verification code')
      return
    }
    setLoading(true)
    setIsError(false)
    try {
      await axios.get(
        `http://localhost:3000/users/email-verify?code=${code}&email=${email}`
      )
      navigate('/login')
    } catch (error) {
      setIsError(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    const isEmailVerified = async () => {
      try {
        await axios.get(
          `http://localhost:3000/users/email-verify?code=${code}&email=${email}`
        )
        setLoading(false)
      } catch (err) {
        if (
          err.response.data.message === 'Email is already verified' ||
          (err.response.data.message ===
            'Verification code is invalid or has expired' &&
            !email)
        ) {
          setIsVerified(true)
        }
        setLoading(false)
      }
    }
    isEmailVerified()
  }, [])

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ClipLoader size={18} />
      </div>
    )
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center">
        <div
          className={`rounded-md bg-white p-6 shadow-md ${
            isVerified ? 'w-[40%] max-sm:w-[70%]' : 'w-[70%]'
          } max-sm:space-y-7`}
        >
          {isVerified && (
            <div className="flex flex-col items-center">
              <h2 className="text-2xl text-center font-bold text-primary mb-4 max-md:text-xl">
                Verification code is invalid or has expired
              </h2>
              <button
                className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                onClick={() => {
                  navigate(-1)
                }}
              >
                goBack
              </button>
            </div>
          )}
          {!isVerified && (
            <>
              <h2 className="mb-4 text-2xl font-bold max-sm:text-xl max-sm:text-center">
                Verify your email address
              </h2>
              <p className="mb-4 leading-7">
                A verification code was sent to your email address. Please
                either
                <span className="font-bold"> follow </span>
                the link in the email or
                <span className="font-bold"> enter </span>
                the code below.
              </p>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Verification code"
                  className="w-full rounded-lg border-2 border-gray-200 p-2"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                />
              </div>
              {isError && (
                <div className="mb-4 text-sm text-red-500">
                  The code you entered is incorrect.
                </div>
              )}
              <div className="flex max-sm:justify-center">
                <button
                  disabled={loading}
                  className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-50"
                  onClick={handleVerify}
                >
                  {loading ? <ClipLoader size={18} /> : 'Verify'}
                </button>
                <button
                  className="ml-4 rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                  onClick={() => {
                    navigate(-1)
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
