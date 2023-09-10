import React, { useState, useEffect, useRef } from "react";
import { updateUser } from "../services/users";
import {AiOutlineClose } from "react-icons/ai";

const ValidationForm = ({ onUserCreate, onClickOutside, editingUser, toggleClose }) => {
  const initialUser = {
    name: "",
    username: "",
    email: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
    },
  };

  const [newUser, setNewUser] = useState(initialUser);
  const createUserRef = useRef(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    const address = {
      ...newUser.address,
      [name]: value,
    };
    setNewUser((prevUser) => ({
      ...prevUser,
      address,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!newUser.name.trim()) {
      errors.name = "Name is required";
    }
    if (!newUser.username.trim()) {
      errors.username = "Username is required";
    }
    if (!newUser.email.trim()) {
      errors.email = "Email is required";
    }
    if (!newUser.address.street.trim()) {
      errors.street = "Street is required";
    }
    if (!newUser.address.suite.trim()) {
      errors.suite = "Suite is required";
    }
    if (!newUser.address.city.trim()) {
      errors.city = "City is required";
    }
    if (!newUser.address.zipcode.trim()) {
      errors.zipcode = "Zipcode is required";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valErr = validateForm();
    if (Object.keys(valErr).length === 0) {
      console.log("Editing User:", editingUser);
      console.log("New User Data:", newUser);
  
      if (editingUser) {
        updateUser(editingUser.id, newUser)
          .then((updatedUser) => {
            console.log("Updated User Response:", updatedUser);
            onUserCreate(updatedUser);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        // Check if the newUser has an 'id' property
        if (newUser.id) {
          // If 'id' exists, it means the user was previously created
          updateUser(newUser.id, newUser)
            .then((updatedUser) => {
              console.log("Updated User Response:", updatedUser);
              onUserCreate(updatedUser);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          // If 'id' doesn't exist, it means it's a new user
          onUserCreate(newUser);
        }
      }
      setNewUser(initialUser);
      setValidationErrors({});
    } else {
      setValidationErrors(valErr);
    }
  };
  

  useEffect(() => {
    // Prepopulate the form fields if editingUser is provided
    if (editingUser) {
      setNewUser(editingUser);
    } else {
      // Clear the form if creating a new user
      setNewUser(initialUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingUser]);

  // Use useEffect to attach a click event listener when the component mounts
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (createUserRef.current && !createUserRef.current.contains(e.target)) {
        // Click occurred outside the CreateUser component
        onClickOutside();
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClickOutside]);

  return (
    <div // Assign the ref to the wrapping div
      className="  backdrop-blur-sm absolute w-full top-0 left-0 h-full z-50   "
    >
      <form onSubmit={handleSubmit}>
        <div
          className=" border-2 bg-white absolute max-md:inset-x-3  lg:w-fit inset-x-[30%] top-[10%]  z-50 shadow-md  p-10 rounded-xl  mx-auto "
          ref={createUserRef}
        >
            <AiOutlineClose className=" hover:scale-95 transition-all absolute right-4 top-4  cursor-pointer " color="red" size={32} onClick={toggleClose}/>
         
          <h1 className=" pt-12 pb-12 font-bold text-3xl tracking-wider ">
            {editingUser ? "Edit User" : "Create User"}
          </h1>

          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
            />
            {validationErrors.name && (
              <p className="text-red-500">{validationErrors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username" 
              name="username"
              value={newUser.username}
              onChange={handleInputChange}
            />
            {validationErrors.username && (
              <p className="text-red-500">{validationErrors.username}</p>
            )}
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
            />
            {validationErrors.email && (
              <p className="text-red-500">{validationErrors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="street">Street:</label>
            <input
              type="text"
              id="street"
              name="street"
              value={newUser.address.street}
              onChange={handleAddressInputChange}
            />
            {validationErrors.street && (
              <p className="text-red-500">{validationErrors.street}</p>
            )}
          </div>
          <div>
            <label htmlFor="suite">Suite:</label>
            <input
              type="text"
              id="suite"
              name="suite"
              value={newUser.address.suite}
              onChange={handleAddressInputChange}
            />
            {validationErrors.suite && (
              <p className="text-red-500">{validationErrors.suite}</p>
            )}
          </div>
          <div>
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={newUser.address.city}
              onChange={handleAddressInputChange}
            />
            {validationErrors.city && (
              <p className="text-red-500">{validationErrors.city}</p>
            )}
          </div>
          <div>
            <label htmlFor="zipcode">Zipcode:</label>
            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={newUser.address.zipcode}
              onChange={handleAddressInputChange}
            />
            {validationErrors.zipcode && (
              <p className="text-red-500">{validationErrors.zipcode}</p>
            )}
          </div>
          <button
            className=" mt-12 max-md:w-48 font-medium tracking-wider h-[2em]  w-72 text-lg mx-auto  hover:bg-gray-400 hover:font-bold  transition-all  bg-gray-300 rounded-lg "
            type="submit"
          >
            {editingUser ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ValidationForm;
