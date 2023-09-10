// ignore this code 


import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchData, createData, updateData, deleteData }  from "../services/users";

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [editUser, setEditUser] = useState({ id: null, name: "", email: "" });

  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleCreate = async () => {
    try {
      const createdUser = await createData(newUser);
      setData([...data, createdUser]);
      setNewUser({ name: "", email: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedUser = await updateData(editUser.id, editUser);
      const updatedData = data.map((user) =>
        user.id === editUser.id ? updatedUser : user
      );
      setData(updatedData);
      setEditUser({ id: null, name: "", email: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteData(userId);
      const updatedData = data.filter((user) => user.id !== userId);
      setData(updatedData);
    } catch (error) {
      console.error(error);
    }
  };

  const contextValue = {
    data,
    loading,
    newUser,
    editUser,
    setNewUser,
    setEditUser,
    handleCreate,
    handleUpdate,
    handleDelete,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
