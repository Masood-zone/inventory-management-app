import React,{ useState, useEffect } from "react"
import { Save } from "lucide-react"
import type { Settings as SettingsType } from "../types"

interface SettingsProps {
  settings: SettingsType | null
  setSettings: React.Dispatch<React.SetStateAction<SettingsType | null>>
  isLoading: boolean
}

export default function Settings({ settings, setSettings, isLoading }: SettingsProps) {
  const [formData, setFormData] = useState<SettingsType>({
    companyName: "",
    email: "",
    currency: "USD",
    darkMode: false,
    notifications: true,
    backupEnabled: false,
    backupFrequency: "weekly",
    backupLocation: "",
  })

  useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement
      setFormData({
        ...formData,
        [name]: target.checked,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    try {
      const updatedSettings = await window.api.saveSettings(formData)
      setSettings(updatedSettings)
      alert("Settings saved successfully!")
    } catch (error) {
      console.error("Failed to save settings:", error)
      alert("Failed to save settings")
    }
  }

  const handleBackup = async (): Promise<void> => {
    if (!formData.backupLocation) {
      alert("Please enter a backup location")
      return
    }

    try {
      const result = await window.api.backupData(formData.backupLocation)
      if (result.success) {
        alert(result.message)
      } else {
        alert(`Backup failed: ${result.message}`)
      }
    } catch (error) {
      console.error("Backup failed:", error)
      alert("Backup failed")
    }
  }

  const handleRestore = async (): Promise<void> => {
    if (!formData.backupLocation) {
      alert("Please enter a backup location")
      return
    }

    if (confirm("Restoring data will overwrite your current data. Are you sure you want to continue?")) {
      try {
        const result = await window.api.restoreData(formData.backupLocation)
        if (result.success) {
          alert(result.message)
          // Reload the app to reflect the restored data
          window.location.reload()
        } else {
          alert(`Restore failed: ${result.message}`)
        }
      } catch (error) {
        console.error("Restore failed:", error)
        alert("Restore failed")
      }
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">General Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                className="input"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency
              </label>
              <select id="currency" name="currency" className="input" value={formData.currency} onChange={handleChange}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="darkMode"
              name="darkMode"
              checked={formData.darkMode}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Dark Mode
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifications"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Notifications
            </label>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Backup & Sync</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="backupEnabled"
                name="backupEnabled"
                checked={formData.backupEnabled}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="backupEnabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable Cloud Backup
              </label>
            </div>

            {formData.backupEnabled && (
              <>
                <div>
                  <label
                    htmlFor="backupFrequency"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Backup Frequency
                  </label>
                  <select
                    id="backupFrequency"
                    name="backupFrequency"
                    className="input"
                    value={formData.backupFrequency}
                    onChange={handleChange}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="backupLocation"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Backup Location (URL)
                  </label>
                  <input
                    type="text"
                    id="backupLocation"
                    name="backupLocation"
                    className="input"
                    placeholder="e.g. https://cloud-storage.com/my-backup"
                    value={formData.backupLocation}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex space-x-2 mt-4">
                  <button type="button" className="btn bg-blue-500 text-white hover:bg-blue-600" onClick={handleBackup}>
                    Backup Now
                  </button>
                  <button
                    type="button"
                    className="btn bg-yellow-500 text-white hover:bg-yellow-600"
                    onClick={handleRestore}
                  >
                    Restore Data
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary flex items-center">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}

