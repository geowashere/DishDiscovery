import { Switch } from '@mui/material'
import { useChangeNotificationPreferenceMutation } from '../../redux/slices/userApiSlice'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectNotificationPreference } from '../../redux/slices/authSlice'
import { useGetUserQuery } from '../../redux/slices/userApiSlice'

const NotificationsSetting = ({ setting }) => {
  const [changeNotificationPreference] =
    useChangeNotificationPreferenceMutation()

  const preference = useSelector(selectNotificationPreference(setting.type))
  const [booleanValue, setBooleanValue] = useState(preference)
  const { refetch: refetchUser } = useGetUserQuery('User')
  const handleChange = async () => {
    const preferenceData = {
      type: setting.type,
      value: !preference,
    }

    setBooleanValue(prevValue => !prevValue)
    const res = await changeNotificationPreference(preferenceData)
    refetchUser()
    console.log(res)
  }

  return (
    <>
      <div className="flex justify-between grow w-full">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-primary">
            {setting.notification}
          </h2>
          <p className="text-primary-50">{setting.description}</p>
        </div>
        <Switch
          checked={booleanValue}
          inputProps={{ 'aria-label': 'controlled' }}
          color="default"
          onChange={handleChange}
        />
      </div>
    </>
  )
}

export default NotificationsSetting
