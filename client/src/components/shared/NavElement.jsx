import { IconButton } from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'

const NavElement = ({
  navElement,
  opacity,
  selected,
  getActive,
  nbOfUnreadNotifs,
}) => {
  return (
    <div
      className="flex justify-start center w-full gap-3 text-white py-3 px-3 nav-element relative"
      onClick={() => getActive(navElement.location)}
      style={{
        backgroundColor: selected ? '#FFFAF5' : '#333329',
      }}
    >
      {navElement.header === 'Profile' && (
        <img src={navElement.icon} className="size-10 rounded-full" />
      )}

      {navElement.icon === NotificationsNoneIcon &&
        navElement.header !== 'Profile' && (
          <IconButton
            sx={{ color: selected ? '#333329' : '#FFFAF5' }}
            className="nav-icon"
            value={navElement.header}
          >
            <navElement.icon></navElement.icon>
            {nbOfUnreadNotifs > 0 && (
              <small
                className="absolute top-0 right-0 rounded-full font-light"
                style={{
                  fontSize: '12px',
                  padding: nbOfUnreadNotifs >= 100 ? '' : '0 5px',
                  background: '#f50057',
                }}
              >
                {nbOfUnreadNotifs}
              </small>
            )}
          </IconButton>
        )}

      {navElement.icon !== NotificationsNoneIcon &&
        navElement.header !== 'Profile' && (
          <IconButton
            sx={{ color: selected ? '#333329' : '#FFFAF5' }}
            className="nav-icon"
            value={navElement.header}
          >
            <navElement.icon></navElement.icon>
          </IconButton>
        )}
      <h2
        className={`text-3xl nav-header`}
        style={{
          opacity: opacity,
          transitionProperty: 'opacity',
          transitionDuration: '0.5s',
          color: selected ? '#333329' : '#FFFAF5',
        }}
      >
        {navElement.header}
      </h2>
    </div>
  )
}

export default NavElement
