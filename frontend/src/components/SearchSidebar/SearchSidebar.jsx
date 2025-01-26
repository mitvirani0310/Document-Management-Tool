import { useState } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";

const SearchSidebar = ({
  searchPluginInstance,
  searchQuery,
  setSearchQuery,
  searchButtonRef
}) => {
  const { theme } = useTheme();
  const { Search } = searchPluginInstance;
  const [matches, setMatches] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(0);

  return (
    <Search>
      {({ search, jumpToNextMatch, jumpToPreviousMatch }) => (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                search(searchQuery).then(matches => {
                  setMatches(matches);
                  setCurrentMatch(matches.length > 0 ? 1 : 0);
                });
              }
            }}
            placeholder="Search in document..."
            className={`flex-1 px-4 py-2 rounded-lg ${
              theme === 'dark' 
                ? 'bg-gray-700 text-white placeholder-gray-400' 
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
            }`}
          />
          <button
            ref={searchButtonRef}
            onClick={() => {
              if (searchQuery.trim()) {
                search(searchQuery).then(matches => {
                  setMatches(matches);
                  setCurrentMatch(matches.length > 0 ? 1 : 0);
                });
              }
            }}
            className={`p-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            <FiSearch className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                jumpToPreviousMatch();
                setCurrentMatch(prev => prev > 1 ? prev - 1 : matches.length);
              }}
              disabled={matches.length === 0}
              className={`p-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {matches.length > 0 ? `${currentMatch}/${matches.length}` : '0/0'}
            </span>
            <button
              onClick={() => {
                jumpToNextMatch();
                setCurrentMatch(prev => prev < matches.length ? prev + 1 : 1);
              }}
              disabled={matches.length === 0}
              className={`p-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Search>
  );
};

export default SearchSidebar;