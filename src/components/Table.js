import React, { useEffect, useState } from "react";
import {
  fetchData,
  createUser,
  updateUser,
  deleteUser,
} from "../services/users";
import { DataGrid } from "@mui/x-data-grid";
import { useSearchContext } from "../context/SearchContext";

import ValidationForm from "./ValidationForm";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const TableComponent = () => {
  const [data, setData] = useState([]); // empty array
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null); // Track the selected row
  const [selectedRowIds, setSelectedRowIds] = useState([]); // handle delete

  const [editingUser, setEditingUser] = useState(null);

  const searchContext = useSearchContext(); // Get the entire context object

  const toggleClose = () => {
    setIsCreateUserOpen((prev) => !prev);
  };
  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "address.street",
      headerName: "Street",
      width: 150,
      valueGetter: (params) => params.row.address?.street || "",
    },
    {
      field: "address.suite",
      headerName: "Suite",
      width: 150,
      valueGetter: (params) => params.row.address?.suite || "",
    },
    {
      field: "address.city",
      headerName: "City",
      width: 150,
      valueGetter: (params) => params.row.address?.city || "",
    },
    {
      field: "address.zipcode",
      headerName: "Zipcode",
      width: 150,
      valueGetter: (params) => params.row.address?.zipcode || "",
    },
  ];

  // Check if there's a search query
  const filteredData = searchContext.searchQuery
    ? data.filter((item) =>
        item.name
          .toLowerCase()
          .includes(searchContext.searchQuery.toLowerCase())
      )
    : data; // Display all data when searchQuery is empty

  const handleEdit = () => {
    if (selectedRowId !== null) {
      // If a row is selected, open the CreateUser component and prepopulate it
      const userToEdit = data.find((user) => user.id === selectedRowId);
      if (userToEdit) {
        setIsCreateUserOpen(true);
        setEditingUser(userToEdit); // Set editingUser to the selected user
      }
    } else {
      window.alert("You cannot edit more than one user at a time.");
    }
  };
  const handleCreate = async (newUser) => {
    try {
      let updatedData;
  
      if (editingUser) {
        // If editingUser is not null, it means we are updating an existing user
        const updatedUser = await updateUser(editingUser.id, newUser);
        updatedData = data.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
      } else {
        // If editingUser is null, it means we are creating a new user
  
        // Include an 'id' property in the newUser object, even if it's null
        newUser.id = null;
  
        const createdUser = await createUser(newUser);
  
        // Check if the createdUser has an 'id' property
        if (createdUser.id) {
          // Use the 'id' from the created user object
          updatedData = [createdUser, ...data]; // Prepend the new user to the array
        } else {
          // If 'id' doesn't exist, append the entire createdUser object
          updatedData = [createdUser, ...data]; // Prepend the new user to the array
        }
      }
  
      setData(updatedData);
      setEditingUser(null);
      setIsCreateUserOpen(false);// close the component
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleDelete = async () => {
    if (selectedRowIds.length > 0) {
      // If there are selected rows, confirm deletion
      if (
        window.confirm("Are you sure you want to delete the selected users?")
      ) {
        try {
          // Create an array of promises to delete all selected rows
          const deletePromises = selectedRowIds.map((id) => deleteUser(id));

          // Wait for all delete operations to complete
          await Promise.all(deletePromises);

          // Filter out the deleted rows from the data
          setData((prevData) =>
            prevData.filter((user) => !selectedRowIds.includes(user.id))
          );

          // Clear the selected row IDs
          setSelectedRowIds([]);
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      console.log("No rows selected.");
    }
  };

  const openCreateUser = () => {
    setIsCreateUserOpen(true);
    setEditingUser(null); // Clear editingUser when creating a new user
  };

  const handleClickOutside = () => {
    // Function to handle clicks outside of CreateUser component
    setIsCreateUserOpen(false); // Close the CreateUser component
    setEditingUser(null); // Clear editingUser
  };

  const handleSelectionModelChange = (newSelection) => {
    if (newSelection.length === 1) {
      // Only allow single row selection for editing
      setSelectedRowId(newSelection[0]);
    } else {
      setSelectedRowId(null);
    }

    // Set selectedRowIds for multi-row selection
    setSelectedRowIds(newSelection);
  };

  return (
    <div className="h-[500px] pt-[5em]">
      <Box>
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={handleDelete}>
            Delete User
          </Button>
          <Button size="small" onClick={handleEdit}>
            Edit User
          </Button>
          <Button size="small" onClick={openCreateUser}>
            Create User
          </Button>
        </Stack>
      </Box>
      {isCreateUserOpen && (
        <ValidationForm
          editingUser={editingUser}
          onUserCreate={handleCreate}
          onClickOutside={handleClickOutside}
          toggleClose={toggleClose}
        />
      )}
      <DataGrid
        rows={filteredData}
        columns={columns}
        pageSize={5}
        checkboxSelection
        disableColumnSelector
        rowsPerPageOptions={[5, 10, 20]}
        pagination
        onRowSelectionModelChange={handleSelectionModelChange}
        selectionModel={selectedRowIds}
      />
    </div>
  );
};

export default TableComponent;
