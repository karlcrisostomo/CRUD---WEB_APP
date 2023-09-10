import axios from "axios";

const apiUrl = "https://jsonplaceholder.typicode.com/users";

export const fetchData = async () => {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createUser = async (newUser) => {
  try {
    const response = await axios.post(apiUrl, newUser);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUser = async (userId, updatedUser) => {
  try {
    const response = await axios.put(`${apiUrl}/${userId}`, updatedUser);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${apiUrl}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
