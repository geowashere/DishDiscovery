import { useState } from 'react'
import FollowingsModal from '../Modals/FollowingsModal'
import FollowersModal from '../Modals/FollowersModal'
import { useParams } from 'react-router-dom'

const UserStats = ({ info, totalFollowers, totalFollowing, totalRecipes }) => {
  const [openFollowings, setOpenFollowings] = useState(false)
  const [openFollowers, setOpenFollowers] = useState(false)

  const showModal = () => {
    if (info === 'Posts') return
    if (info === 'Followings' && !id) setOpenFollowings(true)
    if (info === 'Followers' && !id) setOpenFollowers(true)
  }

  const { id } = useParams()

  return (
    <>
      <div
        className={`flex flex-col items-center text-primary ${
          id
            ? ''
            : info === 'Posts' && id
            ? ''
            : 'hover:shadow-card-shadow hover:rounded-lg cursor-pointer'
        }`}
        onClick={showModal}
      >
        {info === 'Posts' && (
          <p className="text-2xl max-sm:text-[20px] max-mobile:text-[14px]">
            {totalRecipes ? totalRecipes : '0'}
          </p>
        )}
        {info === 'Followers' && (
          <p className="text-2xl max-sm:text-[20px] max-mobile:text-[14px]">
            {totalFollowers ? totalFollowers : '0'}
          </p>
        )}
        {info === 'Followings' && (
          <p className="text-2xl max-sm:text-[20px] max-mobile:text-[14px]">
            {totalFollowing ? totalFollowing : '0'}
          </p>
        )}
        <p className="text-2xl max-sm:text-[20px] max-mobile:text-[14px] max-mobile:break-words">
          {info}
        </p>
      </div>
      {openFollowings && (
        <FollowingsModal
          openFollowings={openFollowings}
          setOpenFollowings={setOpenFollowings}
        />
      )}
      {openFollowers && (
        <FollowersModal
          openFollowers={openFollowers}
          setOpenFollowers={setOpenFollowers}
        />
      )}
    </>
  )
}

export default UserStats
