import { useSelector } from 'react-redux'
import AdminTabs from '../components/Tabs/AdminTabs'

const Admin = () => {
  const { role } = useSelector(state => state.auth.user)
  if (role === 'general')
    return (
      <div className="flex justify-center grow items-center bg-background">
        <h1 className="text-3xl">Only admins</h1>
      </div>
    )
  return (
    <>
      <div className="flex flex-col lg:gap-10 lg:p-10 grow bg-background max-h-screen overflow-hidden">
        <h1 className="text-3xl max-lg:hidden">Admin Panel</h1>
        <AdminTabs />
      </div>
    </>
  )
}
export default Admin
