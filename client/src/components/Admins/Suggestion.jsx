import {
  useGetAllSuggestionsQuery,
  useCheckSuggestionMutation,
  useUnCheckSuggestionMutation,
  useDeleteSuggestionMutation,
} from '../../redux/slices/adminApiSlice'
import { Checkbox, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { terror, tsuccess } from '../../utils/toasts'

const Suggestion = ({ suggestionId }) => {
  const { suggestion } = useGetAllSuggestionsQuery('suggestionsList', {
    selectFromResult: ({ data }) => ({
      suggestion: data?.entities[suggestionId],
    }),
  })

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
  const [checkSuggestion] = useCheckSuggestionMutation()
  const [unCheckSuggestion] = useUnCheckSuggestionMutation()
  const [deleteSuggestion] = useDeleteSuggestionMutation()

  const handleCheck = async () => {
    try {
      suggestion.isAccepted
        ? await unCheckSuggestion({ suggestionId })
        : await checkSuggestion({ suggestionId })
    } catch (error) {
      console.error(error)
      terror('Something went wrong')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteSuggestion({ suggestionId })
      tsuccess('Suggestion deleted successfully')
    } catch (error) {
      console.error(error)
      terror('Something went wrong')
    }
  }

  return (
    <div className="space-y-2 bg-[#ebe8e8] rounded-lg p-4 w-11/12 max-lg:self-center">
      <h3 className="text-primary  font-medium">{suggestion?.user}</h3>
      <div className="flex items-center justify-between gap-2">
        <p className="text-lg text-primary break-all max-lg:text-base">
          {suggestion?.content}
        </p>

        <div className="flex items-center gap-1 self-start">
          <Checkbox
            {...label}
            color="default"
            onChange={handleCheck}
            checked={suggestion?.isAccepted || false}
          />
          <IconButton onClick={handleDelete}>
            <DeleteIcon
              sx={{
                fontSize: 25,
                color: '#898784',
                ':hover': {
                  color: 'red',
                  cursor: 'pointer',
                  transition: 'color .5s',
                },
              }}
            />
          </IconButton>
        </div>
      </div>
      <h3 className="text-right text-sm">{suggestion?.createdAt}</h3>
    </div>
  )
}

export default Suggestion
