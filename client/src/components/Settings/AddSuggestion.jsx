import { useState } from 'react'
import { TextField, Button } from '@mui/material'
import { useAddSuggestionMutation } from '../../redux/slices/userApiSlice'
import { terror, tsuccess, twarn } from '../../utils/toasts'
import { ClipLoader } from 'react-spinners'

const AddSuggestion = ({ windowWidth }) => {
  const [suggestion, setSuggestion] = useState('')
  const [addSuggestion] = useAddSuggestionMutation()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (!suggestion.trim()) {
      twarn('Suggestion cannot be empty')
      return
    }
    setIsLoading(true)
    try {
      await addSuggestion({ content: suggestion })
      setSuggestion('')
      tsuccess('Suggestion sent successfully')
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      terror('Something went wrong')
    }
  }
  return (
    <div className="w-9/12 max-lg:w-[90%] h-full p-2 max-lg:pt-4 flex flex-col justify-center gap-4 overflow-y-auto list-scroll-bar">
      <TextField
        fullWidth
        value={suggestion}
        multiline
        rows={10}
        placeholder="Write your suggestion here..."
        onChange={e => setSuggestion(e.target.value)}
      />
      <Button
        disabled={isLoading}
        sx={{
          marginRight: 0,
          alignSelf: windowWidth < 1024 ? 'center' : 'flex-end',
          width: '30%',
          textTransform: 'none',
          background: '#333329',
          color: '#fff',
          padding: '10px',
          '&:hover': {
            background: '#FFFFFF',
            color: '#333329',
          },
        }}
        onClick={handleClick}
      >
        {isLoading ? <ClipLoader size={25} color="white" /> : 'Submit'}
      </Button>
    </div>
  )
}

export default AddSuggestion
