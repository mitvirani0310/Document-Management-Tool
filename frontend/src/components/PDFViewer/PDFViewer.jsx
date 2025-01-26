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

const PDFViewer = forwardRef(({ pdfUrl, isLoading }, ref) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showBookmarks, setShowBookmarks] = useState(false)
  const viewerRef = useRef(null)
  // const searchPluginInstance = searchPlugin()
  const zoomPluginInstance = zoomPlugin()
  const bookmarkPluginInstance = bookmarkPlugin()
  const searchButtonRef = useRef(null)
  const { theme } = useTheme()
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance


  const searchPluginInstance = searchPlugin({
    keyword: searchQuery,
  });

  useImperativeHandle(ref, () => ({
    search: (value) => {
      setSearchQuery(value);
      if (searchButtonRef.current) {
        setTimeout(() => {
          searchButtonRef.current.click();
        }, 20); 
      }
    },
  }));



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
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-full ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500" />
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg`}>
      <div className="p-4 border-b flex items-center justify-between">
        <SearchSidebar
          searchPluginInstance={searchPluginInstance}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchButtonRef={searchButtonRef}
          showBookmarks={showBookmarks} 
        />
        <div className="flex items-center gap-2">
          <ZoomOutButton />
          <ZoomPopover />
          <ZoomInButton />
          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className={`p-2 rounded-lg ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            <FiBookmark className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownload}
            className={`p-2 rounded-lg ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
            disabled={!pdfUrl}
          >
            <FiDownload className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="h-full flex">
          {showBookmarks && (
            <Bookmark
              showBookmarks={showBookmarks}
              toggleBookmarks={toggleBookmarks}
              theme={theme}
            >
              {bookmarkPluginInstance.Bookmarks && <bookmarkPluginInstance.Bookmarks />}
            </Bookmark>
          )}
          <div className="flex-1">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={pdfUrl}
                plugins={[searchPluginInstance, zoomPluginInstance, bookmarkPluginInstance]}
                ref={viewerRef}
              />
            </Worker>
          </div>
        </div>
      </div>
    </div>
  )
})

PDFViewer.displayName = "PDFViewer"
export default PDFViewer

