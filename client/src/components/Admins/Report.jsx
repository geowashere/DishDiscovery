import {
  useGetAllReportsQuery,
  useCloseReportMutation,
  useDeleteReportMutation,
} from '../../redux/slices/adminApiSlice'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Checkbox,
  IconButton,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteIcon from '@mui/icons-material/Delete'
import { terror, tsuccess } from '../../utils/toasts'
import { useSelector } from 'react-redux'

const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

const Report = ({ reportId, reportType }) => {
  const { report } = useGetAllReportsQuery('reportsList', {
    selectFromResult: ({ data }) => ({
      report: data?.entities[reportId],
    }),
  })

  const { username: adminName } = useSelector(state => state.auth.user)
  const [closeReport] = useCloseReportMutation()
  const [deleteReport] = useDeleteReportMutation()

  const handleCheck = async () => {
    try {
      await closeReport({ reportId, adminName })
      tsuccess('The report is successfully closed')
    } catch (error) {
      console.error(error)
      terror('Something went wrong')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteReport({ reportId })
      tsuccess('Report  deleted successfully')
    } catch (error) {
      console.error(error)
      terror('Somethin went wrong')
    }
  }
  if (report) {
    return (
      <div
        className={`${
          reportType === 'all'
            ? 'visible'
            : reportType === 'closed' && report?.isClosed
            ? 'visible'
            : reportType === 'opened' && !report?.isClosed
            ? 'visible'
            : 'hidden'
        }`}
      >
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <p className="text-xl break-words text-primary max-sm:text-lg">
              {report?.username} reported {report?.reportedUserName} for{' '}
              {report?.type}
            </p>
          </AccordionSummary>
          <AccordionDetails>
            <div className="space-y-3">
              <p
                className={`text-primary text-lg break-words max-sm:text-base`}
              >
                {report?.description}
              </p>
              <p
                className={`text-primary text-sm break-words max-sm:text-base`}
              >
                {report?.createdAt}
              </p>
            </div>
          </AccordionDetails>
          <AccordionActions>
            <div
              onClick={() => {
                if (report?.isClosed) {
                  terror(`Already checked by ${report?.closedBy}`)
                }
              }}
            >
              <Checkbox
                {...label}
                color="default"
                disabled={report?.isClosed}
                checked={report?.isClosed}
                onChange={handleCheck}
              />
            </div>
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
          </AccordionActions>
        </Accordion>
      </div>
    )
  }
}

export default Report
