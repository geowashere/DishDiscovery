import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Tab, Box } from '@mui/material'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import GeneralProfileRecipes from '../recipe/GeneralProfileRecipes'
import PublicBooks from '../Book/PublicBooks'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const GeneralProfileTabs = () => {
  const [value, setValue] = useState(0)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const displayContent = (
    <>
      <CustomTabPanel value={value} index={0}>
        <GeneralProfileRecipes />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PublicBooks />
      </CustomTabPanel>
    </>
  )

  return (
    <Box
      sx={{
        width: '100%',
        '@media (max-width: 639px)': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '-20px',
        },
      }}
    >
      <div className="sm:hidden flex justify-center overflow-hidden">
        {displayContent}
      </div>

      <Box
        sx={{
          '@media (min-width: 640px)': {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          },

          '@media (max-width: 639px)': {
            width: '100vw',
            position: 'sticky',
            bottom: '0',
            background: '#FFFAF5',
            padding: '10px',
            marginTop: 'auto',
          },
        }}
      >
        <hr className="w-11/12 mx-auto sm:hidden border-black border-t-1" />
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          indicatorColor={windowWidth <= 649 ? '' : 'transparent'}
          variant={windowWidth <= 639 ? 'fullWidth' : 'standard'}
          sx={{
            '@media (max-width: 639px)': {
              '& .MuiTabs-indicator': {
                background: '#333329',
              },
            },
          }}
          centered
        >
          <Tab
            sx={{
              color: value === 0 ? '#333329 !important' : '',
            }}
            label={windowWidth <= 639 ? '' : 'POSTS'}
            icon={<ArticleOutlinedIcon />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            sx={{ color: value === 1 ? '#333329 !important' : '' }}
            label={windowWidth <= 639 ? '' : 'BOOKS'}
            {...a11yProps(1)}
            icon={<MenuBookOutlinedIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>
      <div className="max-sm:hidden flex justify-center mx-auto">
        {displayContent}
      </div>
    </Box>
  )
}

export default GeneralProfileTabs
