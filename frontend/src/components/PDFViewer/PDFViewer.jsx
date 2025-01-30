import {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { searchPlugin } from "@react-pdf-viewer/search";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { bookmarkPlugin } from "@react-pdf-viewer/bookmark";
import { FiDownload, FiBookmark } from "react-icons/fi";
import SearchSidebar from "../SearchSidebar/SearchSidebar";
import Bookmark from "../Bookmark/Bookmark";
import { useTheme } from "../../contexts/ThemeContext";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/bookmark/lib/styles/index.css";
import React from "react";

const PDFViewer = forwardRef(({ pdfUrl, isLoading,fileName }, ref) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookmarks, setShowBookmarks] = useState(false);
  const viewerRef = useRef(null);
  // const searchPluginInstance = searchPlugin()
  const zoomPluginInstance = zoomPlugin();
  const bookmarkPluginInstance = bookmarkPlugin();
  const searchButtonRef = useRef(null);
  const { theme } = useTheme();
  const { Bookmarks } = bookmarkPluginInstance;

  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

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
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const toggleBookmarks = useCallback(() => {
    setShowBookmarks((prev) => {
      const newState = !prev;
      if (searchQuery.trim() && searchButtonRef.current) {
        setTimeout(() => {
          searchButtonRef.current.click();
        }, 100);
      }
      return newState;
    });
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center h-full ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500" />
         */}
         <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
          <div className="absolute">
            <p className={`text-base font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading PDF...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-lg`}
    >
      <div className="p-4 flex items-center justify-between">
        <SearchSidebar
          searchPluginInstance={searchPluginInstance}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchButtonRef={searchButtonRef}
          showBookmarks={showBookmarks}
        />
        {fileName && <span  className={`text-sm mx-3 font-semibold ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}>{fileName}</span>}
        <div className="flex items-center gap-2" data-theme={theme}>
        <ZoomOutButton pclassName="rv-zoom__button" />
              <ZoomPopover className="rpv-zoom__popover"/>
              <ZoomInButton className="rpv-zoom__button" />
          <button
            onClick={toggleBookmarks}
            className={`p-2 ${
              theme === "dark"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } rounded-lg flex items-center justify-center`}
            title="Toggle Bookmarks"
          >
            <FiBookmark
              className={`w-4 h-4 ${showBookmarks ? "fill-current" : ""}`}
            />
          </button>
          <button
            onClick={handleDownload}
            className={`p-2 rounded-lg ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            disabled={!pdfUrl}
          >
            <FiDownload className="w-4 h-4" />
          </button>
        </div>
      </div>

      {pdfUrl ? (
        <div className="flex flex-1 overflow-hidden">
          <Bookmark
            showBookmarks={showBookmarks}
            toggleBookmarks={toggleBookmarks}
            theme={theme}
          >
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
                plugins={[
                  searchPluginInstance,
                  zoomPluginInstance,
                  bookmarkPluginInstance,
                ]}
                scrollMode="vertical"
                defaultScale="PageWidth"
                theme={theme}
                ref={viewerRef}
              />
            </Worker>
          </div>
        </div>
      ) : (
        <div
          className={`flex-1 flex items-center justify-center ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          No PDF file selected
        </div>
      )}
    </div>
  );
});

PDFViewer.displayName = "PDFViewer";
export default PDFViewer;
