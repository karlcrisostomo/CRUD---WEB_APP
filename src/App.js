import React from "react";
//import { BrowserRouter as Router, Route, Routes } from "react-router-dom";]

import "./Globals.css";
import { SearchBar, Table } from "./components";
import { SearchProvider } from "./context/SearchContext";
const App = () => {
  return (
    <div className="  p-4 bg-[url('../src/assets/grid.svg')]     ">
      <SearchProvider>
        <div className="pt-24 lg:max-w-[1280px] mx-auto h-screen">
          <SearchBar />
          <Table />
        </div>
      </SearchProvider>
    </div>
  );
};

export default App;
