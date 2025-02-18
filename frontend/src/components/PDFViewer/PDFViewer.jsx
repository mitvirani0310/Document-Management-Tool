import { forwardRef, useState, useImperativeHandle, useRef, useCallback } from "react"
import { Worker, Viewer } from "@react-pdf-viewer/core"
import { searchPlugin } from "@react-pdf-viewer/search"
import { zoomPlugin } from "@react-pdf-viewer/zoom"
import { bookmarkPlugin } from "@react-pdf-viewer/bookmark"
import { FiDownload, FiBookmark } from "react-icons/fi"
import SearchSidebar from "../SearchSidebar/SearchSidebar"
import Bookmark from "../Bookmark/Bookmark"
import { useTheme } from "../../contexts/ThemeContext"

import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/zoom/lib/styles/index.css"
import "@react-pdf-viewer/bookmark/lib/styles/index.css"
import React from "react"

const PDFViewer = forwardRef(({ pdfUrl, isLoading, fileName, isExtract }, ref) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showBookmarks, setShowBookmarks] = useState(false)
  const viewerRef = useRef(null)
  const [rects, setRects] = useState([]) // Changed to an array to hold multiple rectangles
  const [startPoint, setStartPoint] = useState(null)
  const [switchMode, setSwitchMode] = useState(false)
  const zoomPluginInstance = zoomPlugin()
  const bookmarkPluginInstance = bookmarkPlugin()
  const searchButtonRef = useRef(null)
  const { theme } = useTheme()
  const { Bookmarks } = bookmarkPluginInstance

  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance
  const [isDragging, setIsDragging] = useState(false)
  const [scaleFactor, setScaleFactor] = useState(1)
  const [originalPageDimensions, setOriginalPageDimensions] = useState(null)
  const [tempRect, setTempRect] = useState(null)

  const searchPluginInstance = searchPlugin({
    keyword: searchQuery,
  })

  useImperativeHandle(ref, () => ({
    search: (value) => {
      setSearchQuery(value)
      if (searchButtonRef.current) {
        setTimeout(() => {
          searchButtonRef.current.click()
        }, 20)
      }
    },
  }))

  const handleMouseDown = (event, pageIndex) => {
    if (!switchMode) return

    const target = event.currentTarget
    const rect = target.getBoundingClientRect()

    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height

    setStartPoint({ x, y, pageIndex })
    setIsDragging(true)
  }

  const handleMouseUp = (event) => {
    if (!startPoint || !isDragging) return

    const target = event.currentTarget
    const rect = target.getBoundingClientRect()

    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height

    const newRect = {
      x: Math.min(startPoint.x, x),
      y: Math.min(startPoint.y, y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y),
      pageIndex: startPoint.pageIndex,
    }

    // Convert coordinates to actual PDF dimensions
    const actualCoordinates = {
      pageNumber: newRect.pageIndex + 1,
      coordinates: {
        x: newRect.x,
        y: newRect.y,
        width: newRect.width,
        height: newRect.height,
      },
    }
    setRects((prevRects) => [...prevRects, newRect])
    setTempRect(null)
    setIsDragging(false)
    setStartPoint(null)
  }

  const handleMouseMove = (event) => {
    if (!isDragging || !startPoint || !switchMode) return

    const target = event.currentTarget
    const rect = target.getBoundingClientRect()

    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height

    const newRect = {
      x: Math.min(startPoint.x, x),
      y: Math.min(startPoint.y, y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y),
      pageIndex: startPoint.pageIndex,
    }

    setTempRect(newRect)
  }

  const renderPage = (props) => {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          userSelect: switchMode ? "none" : "auto",
          cursor: switchMode ? "crosshair" : "auto",
          overflow: "hidden",
          resize: switchMode ? "none" : "auto",
        }}
      >
        {props.canvasLayer.children}
        {props.annotationLayer.children}
        {props.textLayer.children}

        {switchMode && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1000,
            }}
            onMouseDown={(e) => handleMouseDown(e, props.pageIndex)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              if (isDragging) {
                setIsDragging(false)
                setStartPoint(null)
                setTempRect(null)
              }
            }}
          />
        )}

        {/* Permanent rectangles */}
{rects.map(
  (rect, index) =>
    rect.pageIndex === props.pageIndex && (
      <React.Fragment key={index}>
        {/* Label - Placed first to ensure it's rendered above the rectangle */}
        <div
          style={{
            position: "absolute",
            left: `${rect.x * 100}%`,
            top: `${rect.y * 100}%`,
            transform: 'translate(0, -30px)', // Move up by fixed amount
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            color: "white",
            padding: "4px 8px",
            fontSize: "12px",
            borderRadius: "4px",
            zIndex: 1003, // Increased z-index
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          Start: ({rect.x.toFixed(2)}, {rect.y.toFixed(2)}) | 
          End: ({(rect.x + rect.width).toFixed(2)}, {(rect.y + rect.height).toFixed(2)}) | 
          Page: {rect.pageIndex + 1}
        </div>

        {/* Rectangle */}
        <div
          style={{
            position: "absolute",
            border: "2px solid red",
            left: `${rect.x * 100}%`,
            top: `${rect.y * 100}%`,
            width: `${rect.width * 100}%`,
            height: `${rect.height * 100}%`,
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            pointerEvents: "none",
            zIndex: 1001,
          }}
        />
      </React.Fragment>
    ),
)}

        {/* Temporary rectangle while drawing */}
        {tempRect && tempRect.pageIndex === props.pageIndex && (
          <div
            style={{
              position: "absolute",
              border: "2px dashed red",
              left: `${tempRect.x * 100}%`,
              top: `${tempRect.y * 100}%`,
              width: `${tempRect.width * 100}%`,
              height: `${tempRect.height * 100}%`,
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              pointerEvents: "none",
              zIndex: 1001,
            }}
          />
        )}
      </div>
    )
  }

  React.useEffect(() => {
    const updateDimensions = (width, height) => {
      if (width && height) {
        setOriginalPageDimensions({
          width,
          height,
        })
      }
    }

    // You can access the dimensions through the viewerRef if needed
    if (viewerRef.current) {
      const page = viewerRef.current.getElementsByClassName("rpv-core__page")[0]
      if (page) {
        updateDimensions(page.offsetWidth, page.offsetHeight)
      }
    }
  }, [])

  const handleSwitchMode = () => {
    setSwitchMode((prev) => !prev)
    setRects([]) // Clear all rectangles when switching mode
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(pdfUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "document.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const toggleBookmarks = useCallback(() => {
    setShowBookmarks((prev) => {
      const newState = !prev
      if (searchQuery.trim() && searchButtonRef.current) {
        setTimeout(() => {
          searchButtonRef.current.click()
        }, 100)
      }
      return newState
    })
  }, [searchQuery])

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-full ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
          <div className="absolute">
            <p className={`text-base font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {"Loading PDF..."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg`}>
      <div className="px-4 pt-1 flex items-center justify-between">
        <SearchSidebar
          searchPluginInstance={searchPluginInstance}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchButtonRef={searchButtonRef}
          showBookmarks={showBookmarks}
        />

        <div className="flex items-center gap-2" data-theme={theme}>
          <ZoomOutButton pclassName="rv-zoom__button" />
          <ZoomPopover className="rpv-zoom__popover" />
          <ZoomInButton className="rpv-zoom__button" />
          <button
            onClick={toggleBookmarks}
            className={`p-2 ${
              theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"
            } rounded-lg flex items-center justify-center`}
            title="Toggle Bookmarks"
          >
            <FiBookmark className={`w-4 h-4 ${showBookmarks ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={handleDownload}
            className={`p-2 rounded-lg ${
              theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            disabled={!pdfUrl}
          >
            <FiDownload className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-1 mb-2">
        {fileName && (
          <span
            className={`text-sm mb-2  ml-1 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            <span className="text-blue-600">{"File Name : "}</span>
            {fileName}
          </span>
        )}
        {/* {isExtract && (
          <button
          onClick={handleSwitchMode}
          className={`
            flex items-center gap-1.5
            px-3 py-2
            rounded-md
            font-medium
            text-xs
            transition-all duration-200 ease-in-out
            transform hover:scale-105
            shadow-sm hover:shadow-md
            ${switchMode 
              ? `${theme === "dark" 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-red-500 hover:bg-red-600"
                } text-white`
              : `${theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
                } text-white`
            }
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${theme === "dark" 
              ? "focus:ring-offset-gray-800" 
              : "focus:ring-offset-white"
            }
            ${switchMode
              ? "focus:ring-red-500"
              : "focus:ring-emerald-500"
            }
          `}
        >
          <svg 
            className={`w-3.5 h-3.5 ${switchMode ? "text-white" : "text-white"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
{switchMode ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            )}          </svg>
          {switchMode ? "Disable Redacting" : "Redact Manually"}
        </button>
        )} */}
      </div>
      {pdfUrl ? (
        <div className="flex flex-1 overflow-hidden">
          <Bookmark showBookmarks={showBookmarks} toggleBookmarks={toggleBookmarks} theme={theme}>
            <Bookmarks />
          </Bookmark>
          <div
            className={`flex-1 rounded-lg shadow-inner ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-50"
            } overflow-auto border-t border-gray-300`}
          >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={pdfUrl}
                plugins={[searchPluginInstance, zoomPluginInstance, bookmarkPluginInstance]}
                scrollMode="vertical"
                defaultScale="PageWidth"
                {...(switchMode && { renderPage })}
                theme={theme}
                ref={viewerRef}
                enableSplitReact={!switchMode} // Disable split-react when switchMode is true
              />
            </Worker>
          </div>
        </div>
      ) : (
        <div
          className={`flex-1 flex items-center justify-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        >
          No PDF file selected
        </div>
      )}
    </div>
  )
})

PDFViewer.displayName = "PDFViewer"
export default PDFViewer

