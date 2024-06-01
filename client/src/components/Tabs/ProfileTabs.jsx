import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Tabs,
  Tab,
  Box,
  MenuItem,
  Select,
  FormControl,
  ThemeProvider,
} from '@mui/material'
import ProfileRecipes from '../recipe/ProfileRecipes'
import LikedRecipes from '../recipe/LikedRecipes'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ProfileBooks from '../Book/ProfileBooks'
import { borderTheme } from '../../utils/borderTheme'

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

export default function ProfileTabs() {
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const [postsFilter, setPostsFilter] = useState('all')
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

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
        <ProfileRecipes postsFilter={postsFilter} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ProfileBooks />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <LikedRecipes />
      </CustomTabPanel>
    </>
  )

  const displaySelect = (
    <ThemeProvider theme={borderTheme}>
      <FormControl
        sx={{
          m: windowWidth < 649 ? 0 : 1,
          minWidth: 100,
        }}
      >
        <Select
          id="posts-filter"
          value={postsFilter}
          onChange={e => setPostsFilter(e.target.value)}
          sx={{ borderRadius: '10px' }}
        >
          <MenuItem value="all">all</MenuItem>
          <MenuItem value="public">public</MenuItem>
          <MenuItem value="private">private</MenuItem>
          <MenuItem value="pending">pending</MenuItem>
        </Select>
      </FormControl>
    </ThemeProvider>
  )

  return (
    <>
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
        {value === 0 && (
          <div className="sm:hidden flex justify-center">{displaySelect}</div>
        )}
        <div className="sm:hidden overflow-hidden">{displayContent}</div>

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
            <Tab
              sx={{ color: value === 2 ? '#333329 !important' : '' }}
              label={windowWidth <= 639 ? '' : 'LIKED'}
              icon={<FavoriteIcon />}
              iconPosition="start"
              {...a11yProps(2)}
            />
          </Tabs>
          {value === 0 && <div className="max-sm:hidden">{displaySelect}</div>}
        </Box>
        <div className="max-sm:hidden">{displayContent}</div>
      </Box>
    </>
  )
}
