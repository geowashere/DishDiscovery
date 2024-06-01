import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { terror } from '../../utils/toasts'
import axios from 'axios'

const SecurityCode = ({ setActiveSteps, email }) => {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const _continue = async () => {
    if (!code.trim()) {
      terror('Enter the verification code')
      return
    }
    setIsLoading(true)
    setIsError(false)
    try {
      await axios.get(
        `http://localhost:3000/users/verify-reset-code?email=${email}&code=${code}`
      )
      setActiveSteps(3)
    } catch (error) {
      if (
        error?.response?.data?.message === 'The code you entered is incorrect.'
      ) {
        setIsError(true)
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-primary font-[600] text-xl max-sm:text-center">
        Enter security code
      </h1>
      <p className="max-sm:text-center">
        Please check your emails for a message with your code.
      </p>
      <input
        className="w-full rounded-lg border-2 border-gray-200 p-2"
        placeholder="Enter code"
        type="text"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      {isError && (
        <div className="mb-4 text-sm text-red-500 max-sm:text-center">
          The code you entered is incorrect.
        </div>
      )}
      <div className="flex gap-4 max-sm:justify-center max-sm:gap-1 justify-end px-3">
        <button
          className="rounded-lg bg-gray-300 px-4 py-2 max-sm:px-3 max-sm:py-1 text-gray-800 hover:bg-gray-400"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button
          className="rounded-lg bg-gray-300 px-4 py-2  max-sm:px-3 max-sm:py-1 text-gray-800 hover:bg-gray-400"
          onClick={() => setActiveSteps(1)}
        >
          Cancel
        </button>
        <button
          disabled={isLoading}
          className="rounded-lg bg-primary px-4 py-2  max-sm:px-3 max-sm:py-1 text-white hover:bg-primary-50"
          onClick={_continue}
        >
          {isLoading ? <ClipLoader size={24} /> : 'Continue'}
        </button>
      </div>
    </div>
  )
}

export default SecurityCode
