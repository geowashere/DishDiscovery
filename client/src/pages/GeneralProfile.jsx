import React from 'react'
import GeneralProfileTabs from '../components/Tabs/GeneralProfileTabs'
import UserInfo from '../components/Profile/UserInfo'
import { useGetPublicUserQuery } from '../redux/slices/userApiSlice'
import { Navigate, useParams } from 'react-router-dom'
import { ScaleLoader } from 'react-spinners'

const GeneralProfile = () => {
  const { id } = useParams()
  const { data: publicUser, isLoading } = useGetPublicUserQuery(id, {
    skip: id ? false : true,
  })

  if (isLoading)
    return (
      <div className="grow flex items-center justify-center">
        <ScaleLoader size={20} color="#898784" />
      </div>
    )

  if (publicUser.username === 'Deleted User') return <Navigate to="/" />
  return (
    <div className="flex flex-col grow">
      <UserInfo publicUser={publicUser} />
      <GeneralProfileTabs />
    </div>
  )
}

export default GeneralProfile
