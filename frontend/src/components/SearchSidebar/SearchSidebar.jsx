import { useState, useEffect, useRef, useCallback } from "react"
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { useTheme } from "../../contexts/ThemeContext"
import React from 'react';

const SearchStatus = {
  NotSearchedYet: "NotSearchedYet",
  Searching: "Searching",
  FoundResults: "FoundResults",
};

const SearchSidebar = ({ searchPluginInstance, searchQuery, setSearchQuery, searchButtonRef, showBookmarks }) => {
  const { theme } = useTheme()
  const [searchStatus, setSearchStatus] = useState(SearchStatus.NotSearchedYet);
  const { Search } = searchPluginInstance
  const [matches, setMatches] = useState([])
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const inputRef = useRef(null);
  const isNavigating = useRef(false);

  const maintainFocus = useCallback(() => {
    if (inputRef.current && !isNavigating.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(maintainFocus, 100);
    return () => clearTimeout(timeoutId);
  }, [showBookmarks, maintainFocus]);

  return (
    <Search>
      {({
        currentMatch,
        keyword,
        setKeyword,
        jumpToMatch,
        jumpToNextMatch,
        jumpToPreviousMatch,
        search,
      }) => {
        useEffect(() => {
          if (searchQuery !== keyword) {
            setKeyword(searchQuery);
            if (searchQuery.trim()) {
              handleSearch();
            } else {
              setMatches([]);
              setCurrentMatchIndex(0);
            }
          }
        }, [searchQuery, keyword, setKeyword]);

        const handleSearch = () => {
          if (keyword.trim()) {
            setSearchStatus(SearchStatus.Searching);
            setCurrentMatchIndex(0);
            search().then((searchMatches) => {
              setSearchStatus(SearchStatus.FoundResults);
              setMatches(searchMatches);
              if (searchMatches && searchMatches.length > 0) {
                setCurrentMatchIndex(1);
                isNavigating.current = true;
                jumpToMatch(searchMatches[0]);
                setTimeout(() => {
                  isNavigating.current = false;
                  maintainFocus();
                }, 100);
              }
            });
          } else {
            setMatches([]);
            setCurrentMatchIndex(0);
            setSearchStatus(SearchStatus.NotSearchedYet);
            maintainFocus();
          }
        };

        const handleInputChange = (e) => {
          const newValue = e.target.value;
          setKeyword(newValue);
          setSearchQuery(newValue);
        };

        const handleKeyPress = (e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        };

        const handleNextMatch = () => {
          isNavigating.current = true;
          jumpToNextMatch();
          setCurrentMatchIndex((prevIndex) =>
            prevIndex < matches.length ? prevIndex + 1 : 1
          );
          // Don't immediately try to restore focus while navigating
          setTimeout(() => {
            isNavigating.current = false;
          }, 300);
        };

        const handlePreviousMatch = () => {
          isNavigating.current = true;
          jumpToPreviousMatch();
          setCurrentMatchIndex((prevIndex) =>
            prevIndex > 1 ? prevIndex - 1 : matches.length
          );
          // Don't immediately try to restore focus while navigating
          setTimeout(() => {
            isNavigating.current = false;
          }, 300);
        };

        const getDisplayText = () => {
          if (matches.length === 0) return "No matches";
          return `${currentMatchIndex}/${matches.length} matches`;
        };

        return (
          <div className="flex flex-row h-full w-full items-center gap-2 overflow-hidden">
            <div className="flex items-center gap-2 p-2">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  placeholder="Enter to search"
                  value={keyword}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onBlur={() => {
                    if (!isNavigating.current) {
                      setTimeout(() => {
                        if (!isNavigating.current) {
                          maintainFocus();
                        }
                      }, 100);
                    }
                  }}
                  className={`flex-1 px-3 w-72 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }`}
                />
                <button
                  ref={searchButtonRef}
                  onClick={() => {
                    handleSearch();
                    maintainFocus();
                  }}
                  className={`ml-2 p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  <FiSearch />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1">
              <button
                onClick={handlePreviousMatch}
                disabled={matches.length === 0 || currentMatchIndex === 1}
                className={`p-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <FiChevronLeft />
              </button>
              <span
                className={`text-sm mx-3 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {getDisplayText()}
              </span>
              <button
                onClick={handleNextMatch}
                disabled={matches.length === 0 || currentMatchIndex === matches.length}
                className={`p-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        );
      }}
    </Search>
  );
}

export default SearchSidebar

