import { useGetAllSuggestionsQuery } from '../../redux/slices/adminApiSlice'
import { ScaleLoader } from 'react-spinners'
import Suggestion from './Suggestion'

const Suggestions = () => {
  const {
    data: suggestions,
    isLoading,
    isSuccess,
  } = useGetAllSuggestionsQuery('suggestionsList', {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  const { ids: suggestionsListIds } = suggestions || {}

  const displaySuggestions =
    isSuccess &&
    suggestionsListIds?.length &&
    suggestionsListIds.map(suggestionId => (
      <Suggestion key={suggestionId} suggestionId={suggestionId} r />
    ))

  if (isLoading)
    return (
      <div className="text-center">
        <ScaleLoader size={20} color="#898784" />
      </div>
    )
  if (!isSuccess)
    return <h1 className="text-2xl text-center">Something went wrong</h1>

  return (
    <div>
      {suggestionsListIds.length !== 0 ? (
        <div className="flex flex-col gap-5">{displaySuggestions}</div>
      ) : (
        <h1 className="text-center text-2xl  text-primary">
          No suggestions at the moment.
        </h1>
      )}
    </div>
  )
}

export default Suggestions
