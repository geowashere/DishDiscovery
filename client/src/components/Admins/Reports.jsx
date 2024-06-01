import { useGetAllReportsQuery } from '../../redux/slices/adminApiSlice'
import { ScaleLoader } from 'react-spinners'
import Report from './Report'

const Reports = ({ reportType }) => {
  const {
    data: reports,
    isLoading,
    isSuccess,
  } = useGetAllReportsQuery('reportsList', {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  const { ids: reportsListIds } = reports || {}

  const displayReports =
    isSuccess &&
    reportsListIds?.length &&
    reportsListIds.map(reportId => (
      <Report key={reportId} reportId={reportId} reportType={reportType} />
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
      {reportsListIds.length !== 0 ? (
        <div className="space-y-5"> {displayReports}</div>
      ) : (
        <h1 className="text-center text-2xl text-primary">
          No reports at the moment.
        </h1>
      )}
    </div>
  )
}

export default Reports
