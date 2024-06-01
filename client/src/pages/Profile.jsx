import ProfileTabs from '../components/Tabs/ProfileTabs'
import UserInfo from '../components/Profile/UserInfo'
import { useSelector } from 'react-redux'
import { tsuccess } from '../utils/toasts'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { resetToast } from '../redux/slices/toastSlice'

const Profile = () => {
  const dispatch = useDispatch()
  const displayToast = useSelector(state => state.toast.displayToast)
  const message = useSelector(state => state.toast.message)

  useEffect(() => {
    if (displayToast) tsuccess(message)
    dispatch(resetToast())
  }, [])

  return (
    <div className="flex grow flex-col bg-background">
      <UserInfo />
      <ProfileTabs />
    </div>
  )
}

export default Profile
