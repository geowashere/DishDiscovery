import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Tabs,
  Tab,
  Box,
  TextField,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { borderTheme } from '../../utils/borderTheme'
import Ingredients from '../Admins/Ingredients'
import Users from '../Admins/Users'
import Reports from '../Admins/Reports'
import Suggestions from '../Admins/Suggestions'
import IngredientsSVG from '../../assets/ingredients.svg'
import UsersSvg from '../../assets/users.svg'
import ReportsSvg from '../../assets/reports.svg'
import SuggestionSvg from '../../assets/suggestion.svg'
import AddIconHoverSvg from '../../assets/addIconHover.svg'
import AddIconSvg from '../../assets/addIcon.svg'
import SearchIconSvg from '../../assets/searchIcon.svg'
import { useAddIngredientMutation } from '../../redux/slices/recipeApiSlice'
import { terror, twarn } from '../../utils/toasts'
import { useSelector } from 'react-redux'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

const AdminsTabs = () => {
  const [value, setValue] = useState(0)
  const [ingredient, setIngredient] = useState('')
  const [user, setUser] = useState('')
  const [image, setImage] = useState(AddIconSvg)
  const [isClicked, setIsClicked] = useState(false)
  const { exists } = useSelector(state => state.isIngredientExists)
  const [addIngredient] = useAddIngredientMutation()
  const [reportType, setReportType] = useState('all')
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

  const displaySelect = (
    <FormControl
      sx={{
        minWidth: 100,
      }}
    >
      <Select
        id="posts-filter"
        value={reportType}
        onChange={e => setReportType(e.target.value)}
        sx={{ borderRadius: '10px' }}
      >
        <MenuItem value="all">all</MenuItem>
        <MenuItem value="closed">closed</MenuItem>
        <MenuItem value="opened">opened</MenuItem>
      </Select>
    </FormControl>
  )

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleAddIngredient = async () => {
    if (!ingredient.trim()) {
      twarn('Please enter an ingredient')
      return
    }

    if (exists) {
      terror(`'${ingredient}' already exists`)
      return
    }

    setIsClicked(true)

    try {
      const res = await addIngredient({
        ingredient: ingredient.toLowerCase().trim(),
      })

      if (res?.data?.message === 'Ingredient added successfully')
        setIngredient('')

      setIsClicked(false)
    } catch (error) {
      setIsClicked(false)
      console.log(error)
    }
  }
  return (
    <ThemeProvider theme={borderTheme}>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: windowWidth < 1024 ? 'column-reverse' : 'row',
          height: '100%',
          gap: windowWidth < 1024 ? '1rem' : '9rem',
          width: '100%',
        }}
      >
        <div className="flex flex-col h-full ">
          <h3 className="text-2xl max-lg:hidden">
            {value === 0 && 'Ingredients'}
            {value === 1 && 'Users'}
            {value === 2 && 'Reports'}
            {value === 3 && 'Suggestions'}
          </h3>
          <Box
            sx={
              windowWidth < 1024
                ? {
                    position: 'sticky',
                    bottom: '0',
                    background: '#FFFAF5',
                    marginTop: 'auto',
                  }
                : {}
            }
          >
            <hr className="w-full mx-auto lg:hidden border-black border-t-1" />
            <Tabs
              orientation={windowWidth < 1024 ? 'horizontal' : 'vertical'}
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              indicatorColor={windowWidth < 1024 ? '' : 'transparent'}
              variant={
                windowWidth < 1024
                  ? windowWidth < 370
                    ? 'scrollable'
                    : 'fullWidth'
                  : 'standard'
              }
              sx={
                windowWidth < 1024
                  ? {
                      '& .MuiTabs-indicator': {
                        background: '#333329',
                      },
                    }
                  : {}
              }
            >
              <Tab
                icon={
                  <img
                    src={IngredientsSVG}
                    className="sm:size-[1.5rem] max-sm:size-[1rem]"
                    style={{
                      opacity: value === 0 ? 1 : 0.8,
                    }}
                  />
                }
                iconPosition="start"
                sx={{
                  color: value === 0 ? '#333329 !important' : '',
                  alignSelf: windowWidth < 1024 ? 'stretch' : 'flex-start',
                }}
                label={windowWidth < 1024 ? '' : 'Ingredients'}
                {...a11yProps(0)}
              />
              <Tab
                icon={
                  <img
                    src={UsersSvg}
                    className="sm:size-[1.5rem] max-sm:size-[1rem]"
                    style={{
                      opacity: value === 1 ? 1 : 0.8,
                    }}
                  />
                }
                iconPosition="start"
                sx={{
                  color: value === 1 ? '#333329 !important' : '',
                  alignSelf: windowWidth < 1024 ? 'stretch' : 'flex-start',
                }}
                label={windowWidth < 1024 ? '' : 'Users'}
                {...a11yProps(1)}
              />
              <Tab
                icon={
                  <img
                    src={ReportsSvg}
                    className="sm:size-[1.5rem] max-sm:size-[1rem]"
                    style={{
                      opacity: value === 2 ? 1 : 0.8,
                    }}
                  />
                }
                iconPosition="start"
                sx={{
                  color: value === 2 ? '#333329 !important' : '',
                  alignSelf: windowWidth < 1024 ? 'stretch' : 'flex-start',
                }}
                label={windowWidth < 1024 ? '' : 'Reports'}
                {...a11yProps(2)}
              />
              <Tab
                icon={
                  <img
                    src={SuggestionSvg}
                    className="sm:size-[1.5rem] max-sm:size-[1rem]"
                    style={{
                      opacity: value === 3 ? 1 : 0.8,
                    }}
                  />
                }
                iconPosition="start"
                sx={{
                  color: value === 3 ? '#333329 !important' : '',
                  alignSelf: windowWidth < 1024 ? 'stretch' : 'flex-start',
                }}
                label={windowWidth < 1024 ? '' : 'Suggestions'}
                {...a11yProps(3)}
              />
            </Tabs>
          </Box>
        </div>

        <TabPanel value={value} index={0} className="grow h-full">
          <div className="flex flex-col gap-8 max-lg:gap-20  h-full lg:w-10/12 max-lg:w-full max-lg:p-4">
            <div className="space-y-5 max-lg:sticky max-lg:top-0 max-lg:pt-5 max-lg:z-[1]">
              <h2 className="text-2xl text-primary max-lg:text-center">
                Ingredients
              </h2>
              <div className="flex items-center gap-1 ">
                <TextField
                  fullWidth
                  required
                  value={ingredient}
                  placeholder="Ingredient Name"
                  onChange={e => setIngredient(e.target.value)}
                />
                <img
                  src={image}
                  className={`w-10 h-10 pointer-events-${
                    isClicked ? 'none' : 'auto'
                  }`}
                  onMouseEnter={() => setImage(AddIconHoverSvg)}
                  onMouseLeave={() => setImage(AddIconSvg)}
                  onClick={handleAddIngredient}
                />
              </div>
            </div>
            <div className="overflow-y-auto list-scroll-bar h-4/6 max-lg:z-[0]">
              <Ingredients
                ingredient={ingredient.toLowerCase().trim()}
                windowWidth={windowWidth}
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel value={value} index={1} className="grow h-full">
          <div className="flex flex-col gap-8 w-10/12 h-full max-lg:gap-20  lg:w-10/12 max-lg:w-full max-lg:p-4">
            <div className="space-y-5 max-lg:sticky max-lg:top-0 max-lg:pt-5 max-lg:z-[1]">
              <h2 className="text-2xl text-primary max-lg:text-center">
                Users
              </h2>
              <div className="flex items-center relative pr-5">
                <TextField
                  fullWidth
                  required
                  placeholder="Search Users"
                  value={user}
                  onChange={e => setUser(e.target.value)}
                />
                <img
                  src={SearchIconSvg}
                  className="w-10 h-10 absolute right-8"
                />
              </div>
            </div>
            <div className="overflow-y-auto list-scroll-bar h-4/6 max-lg:z-[0]">
              <Users userValue={user} />
            </div>
          </div>
        </TabPanel>

        <TabPanel
          value={value}
          index={2}
          className="grow w-10/12 max-lg:w-full h-full"
        >
          <div className="flex flex-col gap-8 h-full max-lg:gap-20  lg:w-10/12 max-lg:w-full max-lg:p-4">
            <div className="flex justify-between items-center  w-full max-lg:gap-3 max-lg:justify-center max-lg:w-full max-lg:sticky max-lg:top-0 max-lg:pt-5 max-lg:z-[1]">
              <h2 className="text-2xl text-primary max-sm:text-xl">Reports</h2>
              {displaySelect}
            </div>
            <div className="overflow-y-auto list-scroll-bar h-4/6 w-full max-lg:z-[0] max-lg:w-full max-lg:h-[80%] max-lg:px-3">
              <Reports reportType={reportType} />
            </div>
          </div>
        </TabPanel>

        <TabPanel value={value} index={3} className="grow w-full h-full">
          <div className="flex flex-col gap-10 w-10/12 h-full max-lg:gap-20  lg:w-10/12 max-lg:w-full max-lg:p-4">
            <h2 className="text-2xl text-primary max-lg:gap-3 max-lg:text-center max-lg:w-full max-lg:sticky max-lg:top-0 max-lg:pt-5 max-lg:z-[1]">
              Suggestions
            </h2>
            <div className="overflow-y-auto list-scroll-bar h-[75%] w-full max-lg:z-[0] max-lg:w-full max-lg:h-[80%]">
              <Suggestions />
            </div>
          </div>
        </TabPanel>
      </Box>
    </ThemeProvider>
  )
}

export default AdminsTabs
