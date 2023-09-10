import React from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { useSearchContext } from "../context/SearchContext";

const SearchBar = () => {
  const searchContext = useSearchContext(); // Get the entire context object

  const handleSearch = (e) => {
    searchContext.setSearchQuery(e.target.value); // Access setSearchQuery from context object
  };

  const clearSearch = () => {
    searchContext.setSearchQuery(""); // Access setSearchQuery from context object
  };

  return (
    <div>
      <div className="flex items-center bg-gray-100  border-[1px]  border-gray-300 rounded-xl p-2 lg:w-fit h-1/2 mx-auto">
        <AiOutlineSearch className="cursor-pointer" size={32} />
        <input
          className="searchBar"
          type="text"
          value={searchContext.searchQuery} // Access searchQuery from context object
          onChange={handleSearch}
        ></input>
        {searchContext.searchQuery && (
          <AiOutlineClose
            size={20}
            className="cursor-pointer -translate-x-4"
            onClick={clearSearch}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
