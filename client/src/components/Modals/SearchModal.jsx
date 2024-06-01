import {
  Modal,
  Fade,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  ThemeProvider,
} from '@mui/material'
import Search from '@mui/icons-material/Search'
import { borderTheme } from '../../utils/borderTheme'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useState } from 'react'
import SearchUsers from '../Profile/SearchUsers'
import SearchRecipes from '../recipe/SearchRecipes'
import SearchIngredients from '../recipe/SearchIngredients'

const SearchModal = ({ openSearch, setOpenSearch }) => {
  const [searchValue, setSearchValue] = useState('')
  const [searchFilter, setSearchFilter] = useState('Users')

  return (
    <>
      <ThemeProvider theme={borderTheme}>
        <Modal
          open={openSearch}
          onClose={() => setOpenSearch(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Fade in={openSearch}>
            <div className="flex flex-col gap-5 bg-white border-none rounded-sm p-5 w-1/2 md:h-[90%] max-md:w-full max-md:h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-4xl px-2">Search</h2>
                <FormControl
                  sx={{
                    m: 1,
                    minWidth: 120,
                  }}
                >
                  <Select
                    value={searchFilter}
                    onChange={e => setSearchFilter(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value="Users">Users</MenuItem>
                    <MenuItem value="Recipes">Recipes</MenuItem>
                    <MenuItem value="Ingredients">Ingredients</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="flex items-center relative">
                <TextField
                  placeholder={`Search ${
                    searchFilter === 'Users'
                      ? 'Profiles'
                      : searchFilter === 'Recipes'
                      ? 'Recipes'
                      : searchFilter === 'Ingredients'
                      ? 'Ingredients'
                      : ''
                  }`}
                  fullWidth
                  onChange={e => setSearchValue(e.target.value)}
                />
                <IconButton className="absolute right-12">
                  <Search sx={{ fontSize: 30, color: '#898784' }} />
                </IconButton>
              </div>
              <div
                className={`flex flex-col gap-3 modal-scroll-bar overflow-auto ${
                  searchFilter === 'Recipes' ? 'not-last-child-margin' : ''
                }`}
              >
                {searchFilter === 'Users' && (
                  <SearchUsers
                    searchValue={searchValue}
                    setOpenSearch={setOpenSearch}
                  />
                )}
                {searchFilter === 'Recipes' && (
                  <SearchRecipes
                    searchValue={searchValue}
                    setOpenSearch={setOpenSearch}
                  />
                )}
                {searchFilter === 'Ingredients' && (
                  <SearchIngredients
                    searchValue={searchValue}
                    setOpenSearch={setOpenSearch}
                  />
                )}
              </div>
              <div
                className="md:hidden p-1 absolute top-0 left-0"
                onClick={() => setOpenSearch(false)}
              >
                <ArrowBackIcon />
              </div>
            </div>
          </Fade>
        </Modal>
      </ThemeProvider>
    </>
  )
}

export default SearchModal
