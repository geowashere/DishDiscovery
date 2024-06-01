import SettingTabs from '../components/Tabs/SettingTabs'

const Settings = () => {
  return (
    <>
      <div className="flex flex-col lg:gap-10 lg:p-10 bg-background grow max-h-screen overflow-hidden">
        <h1 className="text-3xl max-lg:hidden">Account Settings</h1>
        <SettingTabs />
      </div>
    </>
  )
}

export default Settings
