import HomeIcon from '@mui/icons-material/Home'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import SettingsIcon from '@mui/icons-material/Settings'
import GitHubIcon from '@mui/icons-material/GitHub'
import MenuIcon from '@mui/icons-material/Menu'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NavElement from './NavElement'
import { useEffect, useState } from 'react'
import { IconButton } from '@mui/material'
import { Sidebar } from 'react-pro-sidebar'
import {
  setSideBarStatus,
  toggleSidebar,
} from '../../redux/slices/sideBarSlice'
import {
  useGetUnreadNotificationsQuery,
  useMarkAsReadMutation,
} from '../../redux/slices/notificationsApiSlice'
import { useSelector, useDispatch } from 'react-redux'
import ExitModal from '../Modals/ExitModal'
import SearchModal from '../Modals/SearchModal'

const SideBar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const [isSelected, setIsSelected] = useState('')
  const [prevLocation, setPrevLocation] = useState('')
  const [openSearch, setOpenSearch] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const width = '280px'
  const collapsedWidth = '61px'
  const { role, avatar } = useSelector(state => state.auth.user)

  const navElements = [
    {
      icon: avatar,
      location: '/profile',
      header: 'Profile',
    },
    {
      icon: HomeIcon,
      location: '/home',
      header: 'Home',
    },
    {
      icon: SearchIcon,
      location: '/none',
      header: 'Search',
    },
    {
      icon: NotificationsNoneIcon,
      location: '/notifications',
      header: 'Notifications',
    },
    {
      icon: RestaurantIcon,
      location:
        location.state?.history === 'profile-recipe'
          ? '/edit-recipe'
          : '/create-recipe',
      header:
        location.state?.history === 'profile-recipe'
          ? 'Edit Recipe'
          : 'Create Recipe',
    },
    {
      icon: MenuBookIcon,
      location:
        location.state?.history === 'profile-book'
          ? '/edit-book'
          : '/create-book',
      header:
        location.state?.history === 'profile-book'
          ? 'Edit Book'
          : 'Create Book',
    },
    {
      icon: SettingsIcon,
      location: '/settings',
      header: 'Settings',
    },
  ]

  if (role === 'admin')
    navElements.push({
      icon: AdminPanelSettingsIcon,
      location: '/admin-panel',
      header: 'Admin Panel',
    })

  useGetUnreadNotificationsQuery('UnreadNotifications', {
    refetchOnMountOrArgChange: true,
  })

  const [modalOpen, setModalOpen] = useState(false)

  const { isCollapsed, isToggled } = useSelector(state => state.sideBar)

  const nbOfUnreadNotifs = useSelector(
    state => state.unreadNotifications.nbOfUnreadNotifs
  )

  const [markAsRead] = useMarkAsReadMutation()

  useEffect(() => {
    setIsSelected('/home')
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    setIsSelected(location.pathname === '/' ? '/home' : location.pathname)
  }, [location.pathname])

  useEffect(() => {
    if (windowWidth < 1279) dispatch(setSideBarStatus(false))
  }, [windowWidth])

  const getActive = async location => {
    if (isSelected === '/edit-book' && location === '/edit-book') return
    if (isSelected === '/create-book' && location === '/create-book') return
    if (isSelected === '/create-recipe' && location === '/create-recipe') return
    if (isSelected === '/edit-recipe' && location === '/edit-recipe') return
    if (
      isSelected === '/create-book' ||
      isSelected === '/edit-book' ||
      isSelected === '/create-recipe' ||
      isSelected === '/edit-recipe'
    ) {
      setPrevLocation(isSelected)
      setIsSelected(location)
      setModalOpen(true)
    } else {
      if (location === '/none') {
        setOpenSearch(state => !state)
        return
      }
      setIsSelected(location)
      navigate(location)
    }
    if (location === '/notifications')
      try {
        await markAsRead().unwrap()
      } catch (error) {
        console.log(error)
      }
  }

  return (
    <>
      <div className="flex h-screen sticky top-0 z-10">
        <Sidebar
          backgroundColor="#333329"
          transitionDuration={500}
          collapsedWidth={collapsedWidth}
          collapsed={isCollapsed}
          onBackdropClick={() => dispatch(toggleSidebar(false))}
          toggled={isToggled}
          breakPoint="1279px"
          width={width}
        >
          <div className=" flex flex-col justify-between h-full py-7 w-full">
            <div className="flex gap-1 w-full  items-center whitespace-nowrap">
              <IconButton
                onClick={() => {
                  windowWidth < 1279
                    ? dispatch(toggleSidebar(!isToggled))
                    : dispatch(setSideBarStatus(!isCollapsed))
                }}
              >
                <MenuIcon sx={{ color: '#fff', fontSize: '1.875' }} />
              </IconButton>

              <p
                className={`text-3xl text-white `}
                style={{
                  opacity: isCollapsed ? 0 : 1,
                  transitionProperty: 'opacity',
                  transitionDuration: '0.5s',
                }}
              >
                DishDiscovery
              </p>
            </div>
            <div className="flex flex-col whitespace-nowrap">
              {navElements.map(navElement => {
                return (
                  <NavElement
                    key={navElement.header}
                    navElement={navElement}
                    opacity={isCollapsed ? 0 : 100}
                    getActive={getActive}
                    nbOfUnreadNotifs={nbOfUnreadNotifs}
                    selected={isSelected === navElement.location}
                  />
                )
              })}
            </div>

            <Link
              to="https://github.com/geowashere/Recipe-App/"
              target="_blank"
              className="flex px-5 w-full gap-4 whitespace-nowrap"
            >
              <GitHubIcon sx={{ color: '#fff' }} />
              <p
                className={`text-primary-50`}
                style={{
                  opacity: isCollapsed ? 0 : 1,
                  transitionProperty: 'opacity',
                  transitionDuration: '0.5s',
                }}
              >
                project based app
              </p>
            </Link>
          </div>
        </Sidebar>
        <div className="xl:hidden absolute top-7">
          <IconButton onClick={() => dispatch(toggleSidebar(!isToggled))}>
            <MenuIcon sx={{ color: '#333329', fontSize: '1.875' }} />
          </IconButton>
        </div>
        {openSearch && (
          <SearchModal openSearch={openSearch} setOpenSearch={setOpenSearch} />
        )}
      </div>

      {modalOpen && (
        <ExitModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          location={isSelected}
          setIsSelected={setIsSelected}
          prevLocation={prevLocation}
          setOpenSearch={setOpenSearch}
        />
      )}
    </>
  )
}

export default SideBar
