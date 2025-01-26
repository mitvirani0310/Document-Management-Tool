import { FiBookmark, FiX } from "react-icons/fi";

const Bookmark = ({ showBookmarks, toggleBookmarks, theme, children }) => {
  if (!showBookmarks) return null;

  return (
    <div 
      className={`w-72 flex flex-col border-r transition-all duration-200 
        ${theme === 'dark' 
          ? 'bg-gray-800 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
        }`}
    >
      <div className={`p-4 border-b flex items-center justify-between
        ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <div className="flex items-center gap-2">
          <FiBookmark className="w-5 h-5" />
          <span className="font-medium">Bookmarks</span>
        </div>
        <button
          onClick={toggleBookmarks}
          className={`p-2 rounded-lg transition-colors
            ${theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default Bookmark;