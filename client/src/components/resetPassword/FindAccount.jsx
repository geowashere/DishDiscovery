import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { useSendResetPasswordEmailMutation } from '../../redux/slices/userApiSlice'
import { terror, twarn } from '../../utils/toasts'

const FindAccount = ({ setActiveSteps, email, setEmail }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [sendResetPasswordEmail] = useSendResetPasswordEmailMutation()

  const findAccount = async () => {
    if (!email.trim()) {
      terror('Enter your email')
      return
    }
    setIsLoading(true)
    try {
      const res = await sendResetPasswordEmail({ email })
      console.log('20:', res)

      if (res?.error?.data?.message === 'Please enter a valid email address') {
        terror('Please enter a valid email address')
        setIsLoading(false)
        return
      }

      if (res?.error?.data?.message === 'Please check your email')
        twarn('Please check your email')

      setActiveSteps(2)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }
  return (
    <div className="space-y-5">
      <h1 className="text-primary font-[600] text-xl max-sm:text-center">
        Find Your Account
      </h1>
      <p className="max-sm:text-center">
        Please enter your email address to search for your account.
      </p>
      <input
        className="w-full rounded-lg border-2 border-gray-200 p-2"
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <div className="flex gap-4 justify-end px-3 max-sm:justify-center">
        <button
          className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
          onClick={() => navigate('/login')}
        >
          Cancel
        </button>
        <button
          disabled={isLoading}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-50"
          onClick={findAccount}
        >
          {isLoading ? <ClipLoader size={25} /> : 'Search'}
        </button>
      </div>
    </div>
  )
}

export default FindAccount
