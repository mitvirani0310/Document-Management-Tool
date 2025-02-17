import { FiCheck, FiMinus, FiPlus } from "react-icons/fi"
import { useTheme } from "../../contexts/ThemeContext"
import { useEffect, useState } from "react"

const KeyValueList = ({
  data,
  setData,
  isRedacted,
  handleKeyValueClick,
  isLoading,
  isRedacting,
  isRedact,
  isExtract,
  handleRedactData,
  handleExtractData,
  isSearchable,
}) => {
  const { theme } = useTheme()
  const [selectedKeys, setSelectedKeys] = useState({})
  const [newEntry, setNewEntry] = useState({ key: "", value: "" })
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  //const [newKey, setNewKey] = useState('');
  //const [newValue, setNewValue] = useState('');

  useEffect(() => {
    if (data) {
      const initialSelectedKeys = {}
      Object.keys(data).forEach((key) => {
        initialSelectedKeys[key] = true
      })
      setSelectedKeys(initialSelectedKeys)
    }
  }, [data])

  const handleCheckboxChange = (key) => {
    setSelectedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleRedactWithSelected = () => {
    const selectedData = {}
    Object.entries(data).forEach(([key, value]) => {
      if (selectedKeys[key]) {
        selectedData[key] = value
      }
    })
    handleRedactData(selectedData)
  }

  const handleAddNewEntry = () => {
    if (newEntry.key && newEntry.value) {
      const newData = {
        ...data,
        [newEntry.key]: {
          value: newEntry.value,
          confidence: "N/A",
        },
      }
      setData(newData)
      setNewEntry({ key: "", value: "" })
      setShowNewEntryForm(false) // Hide the form after adding
    }
  }

  if (isLoading) {
    return (
      <div
        className={`w-full ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-4 flex flex-col items-center justify-center min-h-[200px]`}
      >
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
          <div className="absolute">
            <p className={`text-base font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Loading...
            </p>
          </div>
        </div>
        <p className={`text-center font-medium mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Extracting data...
        </p>
      </div>
    )
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className={`w-full ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-4`}>
        {isSearchable && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleExtractData}
              className="px-6 py-1.5 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              Extract Data
            </button>
          </div>
        )}
        <p className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>No data available</p>
      </div>
    )
  }

  return (
    <div
      className={`w-full ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg flex flex-col overflow-hidden`}
    >
      <div className="flex items-center justify-between px-4 py-4">
  <h2 className={`text-xl font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
    {isRedact ? "Data To be Redacted" : "Extracted Data"}
  </h2>
  {isRedact && (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => {
          setShowNewEntryForm(!showNewEntryForm);
          setNewEntry({ key: "", value: "" });
        }}
        className="p-2 rounded-full text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 flex items-center justify-center"
      >
        {showNewEntryForm ? <FiMinus /> : <FiPlus />}
      </button>
      <button
        onClick={handleRedactWithSelected}
        disabled={isRedacting}
        className={`px-6 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200
          ${isRedacting ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isRedacting ? "Redacting..." : "Redact Selected Data"}
      </button>
    </div>
  )}
</div>
      <div className="flex-1 overflow-auto w-full">
  <div className="min-w-full inline-block align-middle">
    <div className="overflow-hidden">
      <table className={`min-w-full divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-200"}`}>
        <thead className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} sticky top-0`}>
          <tr>
            {isRedact && (
              <th scope="col" className={`w-[5%] px-3 py-4 text-center text-xs font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-600"} uppercase tracking-wider`}>
                Select
              </th>
            )}
            <th scope="col" className={`w-[25%] px-3 py-4 text-center text-xs font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-600"} uppercase tracking-wider`}>
              Key
            </th>
            <th scope="col" className={`w-[55%] px-3 py-4 text-left text-xs font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-600"} uppercase tracking-wider`}>
              Value
            </th>
            <th scope="col" className={`w-[15%] px-3 py-4 text-left text-xs font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-600"} uppercase tracking-wider`}>
              Confidence Score
            </th>
          </tr>
        </thead>
        <tbody className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-200"}`}>
          {Object.entries(data).map(([key, valueObj], index) => {
            const confidence = valueObj?.confidence_score ?? valueObj?.confidence
            const confidencePercentage = confidence !== undefined && !isNaN(confidence) ? `${(Number(confidence) * 100).toFixed(0)}%` : "N/A"
            return (
              <tr key={index} className={`${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-all duration-200`}>
                {isRedact && (
                  <td className="w-[5%] px-3 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedKeys[key] || false}
                      onChange={() => handleCheckboxChange(key)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                )}
                <td onClick={() => handleKeyValueClick(valueObj?.value)}
                    className={`w-[25%] px-3 py-4 text-sm font-medium text-center ${theme === "dark" ? "text-gray-200" : "text-gray-900"} cursor-pointer`}>
                  <div className="truncate" title={key}>{key}</div>
                </td>
                <td onClick={() => handleKeyValueClick(valueObj?.value)}
                    className={`w-[55%] px-3 py-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} cursor-pointer`}>
                  <div className="break-words">{valueObj?.value ?? "N/A"}</div>
                </td>
                <td className={`w-[15%] px-3 py-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {confidencePercentage}
                </td>
              </tr>
            )})}
{showNewEntryForm && (
  <tr className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} transition-all duration-300`}>
    {isRedact && <td className="w-[5%] px-3 py-4"></td>}
    <td className="w-[40%] px-3 py-4">
      <input
        type="text"
        value={newEntry.key}
        onChange={(e) => setNewEntry((prev) => ({ ...prev, key: e.target.value }))}
        placeholder="Enter key"
        className="w-full px-3 py-2 rounded-md border text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      />
    </td>
    <td className="w-[50%] px-3 py-4">
      <input
        type="text"
        value={newEntry.value}
        onChange={(e) => setNewEntry((prev) => ({ ...prev, value: e.target.value }))}
        placeholder="Enter value"
        className="w-full px-3 py-2 rounded-md border text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      />
    </td>
    <td className="w-[10%] px-3 py-4">
    <button

onClick={handleAddNewEntry}

className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"

>

<FiCheck size={16} />

</button>
    </td>
  </tr>
)}
        </tbody>
      </table>
    </div>
  </div>
</div>

    </div>
  )
}

export default KeyValueList

