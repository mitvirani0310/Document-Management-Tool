import { useTheme } from "../../contexts/ThemeContext";
import React from "react";

const KeyValueList = ({ data, isRedacted, handleKeyValueClick, isLoading,isRedacting, isRedact, isExtract, handleRedactData, handleExtractData, isSearchable }) => {
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div
        className={`w-full ${theme === "dark" ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-lg p-4 flex flex-col items-center justify-center min-h-[200px]`}
      >
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
          <div className="absolute">
            <p
              className={`text-base font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Loading...
            </p>
          </div>
        </div>
        <p
          className={`text-center font-medium mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
        >
          Extracting data...
        </p>
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div
        className={`w-full ${theme === "dark" ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-lg p-4`}
      >
        {isSearchable &&
          <div className="flex justify-end mb-4">
            <button
              onClick={handleExtractData}
              className="px-6 py-1.5 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              Extract Data
            </button>
          </div>
        }

        <p
          className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
        >
          No data available
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-full ${theme === "dark" ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-lg flex flex-col overflow-hidden`}
    >
      <div className="flex items-center justify-between pr-4">
        <h2
          className={`text-xl font-semibold p-4 ${theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}
        >
          {isRedact ? "Data To be Redacted " : "Extracted Data"}
        </h2>
        {isRedact &&
          <button
            onClick={handleRedactData} disabled={isRedacted}
            className={`px-6 py-1.5 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white ${isRedacted ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
           {isRedacting ? "Redacting..." : "Redact Data"}
          </button>
        }

      </div>
      <div className="flex-1 overflow-auto w-full">
        <table
          className={`w-full divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-200"
            }`}
        >
          <thead
            className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"
              } sticky top-0`}
          >
            <tr>
              <th
                className={`w-1/3 px-6 py-4 text-center text-xs font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                  } uppercase tracking-wider`}
              >
                Key
              </th>
              <th
                className={`w-2/3 px-6 py-4 text-left text-xs font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                  } uppercase tracking-wider`}
              >
                Value
              </th>
              {isExtract &&
                <th
                  className={`w-3/3 px-6 py-4 text-left text-xs font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                    } uppercase tracking-wider`}
                >
                  Confidence Score
                </th>}
            </tr>
          </thead>
          {/* <tbody
            className={`${theme === "dark" ? "bg-gray-800" : "bg-white"
              } divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-200"
              }`}
          >
            {Object.entries(data).map(([key, value], index) => (
              <tr
                key={index}
                onClick={() => handleKeyValueClick(value)}
                className={`${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } cursor-pointer transition-all duration-200`}
              >
                <td
                  className={`w-1/3 px-6 py-4 whitespace-nowrap break-words text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-900"
                    } text-center`}
                >
                  {key}
                </td>
                <td
                  className={`w-2/3 px-6 py-4 whitespace-pre-wrap break-words text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  {value}
                </td>
                {isExtract && (
                  <td
                    className={`w-3/3 px-6 py-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    {value?.confidence_score !== undefined ? value.confidence_score.toFixed(2) : "N/A"}
                  </td>
                )}
              </tr>
            ))}
          </tbody> */}
          <tbody
            className={`${theme === "dark" ? "bg-gray-800" : "bg-white"
              } divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-200"
              }`}
          >
            {Object.entries(data).map(([key, valueObj], index) => {
              const confidence = valueObj?.confidence_score ?? valueObj?.confidence;
              const confidencePercentage =
                confidence !== undefined ? `${(Number(confidence) * 100).toFixed(0)}%` : "N/A";
              return (
                <tr
                  key={index}
                  onClick={() => handleKeyValueClick(valueObj?.value)}
                  className={`${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    } cursor-pointer transition-all duration-200`}
                >
                  <td
                    className={`w-1/3 px-6 py-4 whitespace-nowrap break-words text-sm font-medium text-center ${theme === "dark" ? "text-gray-200" : "text-gray-900"
                      }`}
                  >
                    {key}
                  </td>
                  <td
                    className={`w-2/3 px-6 py-4 whitespace-pre-wrap break-words text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    {valueObj?.value ?? "N/A"}
                  </td>
                  {isExtract && !isRedact && (
                    <td
                      className={`w-3/3 px-6 py-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      {confidencePercentage}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default KeyValueList;
