import { createContext, useCallback, useContext, useState } from "react";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  //   const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);

  // Function to get all users
  const getAllUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users);
      return data.users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }, []);

  // Function to get a user by ID
  const getUserById = async (id) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

  // Function to update a user by ID
  const updateUserById = async (id, updatedData) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      const data = await response.json();
      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === id ? data : user)),
      );
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  // Function to delete a user by ID
  const deleteUserById = async (id) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        setUsers,
        getAllUsers,
        getUserById,
        updateUserById,
        deleteUserById,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
