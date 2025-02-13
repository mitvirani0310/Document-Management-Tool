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

const PDFViewer = forwardRef(({ pdfUrl, isLoading, fileName,isExtract }, ref) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookmarks, setShowBookmarks] = useState(false);
  const viewerRef = useRef(null);
  const [rects, setRects] = useState({});
  const [startPoint, setStartPoint] = useState(null);
  const [switchMode, setSwitchMode] = useState(false);
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


const handleMouseDown = (event, pageNumber) => {
  const { offsetX, offsetY } = event.nativeEvent;
  setStartPoint({ x: offsetX, y: offsetY, pageIndex: pageNumber });
};

const handleMouseUp = (event) => {
  if (!startPoint) return;

  const { offsetX, offsetY } = event.nativeEvent;
  const newRect = {
      x: Math.min(startPoint.x, offsetX),
      y: Math.min(startPoint.y, offsetY),
      width: Math.abs(offsetX - startPoint.x),
      height: Math.abs(offsetY - startPoint.y),
      pageIndex: startPoint.pageIndex, // Store the page index
  };

  setRects(newRect); // Only storing the latest selection
  console.log("New Rect: ", newRect);
  setStartPoint(null);
};

const renderPage = (props) => {
  return (
      <div
          style={{
              position: "relative",
              width: "100%",
              height: "100%",
              userSelect: switchMode ? "none" : "auto",
              cursor: "crosshair",
              overflow: "hidden",
          }}
          onMouseDown={(e) => handleMouseDown(e, props.pageIndex)}
          onMouseUp={handleMouseUp}
      >
          {props.canvasLayer.children}
          {props.annotationLayer.children}
          {props.textLayer.children}

          {/* Render only if the selection belongs to this page */}
          {rects && rects.pageIndex === props.pageIndex && (
              <div
                  style={{
                      position: "absolute",
                      border: "2px solid red",
                      left: `${rects.x}px`,
                      top: `${rects.y}px`,
                      width: `${rects.width}px`,
                      height: `${rects.height}px`,
                      backgroundColor: "rgba(255, 0, 0, 0.2)", // Transparent highlight
                  }}
              />
          )}
      </div>
  );
};

const handleSwitchMode = () => {
  setSwitchMode((prev) => !prev);
  setRects(null);
};

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
            {'Loading PDF...'}
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
      {/* <div className="flex items-center justify-between px-5 py-1 mb-2"> */}
   {fileName && <span  className={`text-sm mb-2  ml-7 mx-3 font-semibold ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}><span className="text-blue-600">{"File Name : "}</span>{fileName}</span>}
                 {/* {isExtract && <button
            onClick={handleSwitchMode}
            className={`py-1 px-2 mr-1 rounded-lg whitespace-nowrap ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white text-[0.70rem] font-normal`}
          >
            {switchMode ? "Disable Redacting" : "Redact Manually"}
          </button>} */}
          {/* {rects && rects.x + "and" + rects.y} */}
   {/* </div> */}
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
                {...(switchMode && { renderPage })}
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
