import { prisma } from "../lib/prisma.ts";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRATION || "1h";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

// Define the public user select fields
const publicUserSelect = {
  id: true,
  email: true,
  emailVerifiedAt: true,
  fullName: true,
  phone: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
  authProvider: true,
};

// Function to generate JWT token
const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

//function to get all users with pagination and filtering
export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, role, isActive } = req.query;

  const filters = {};
  if (role) filters.role = role;
  if (isActive !== undefined) filters.isActive = isActive === "true";

  try {
    const users = await prisma.user.findMany({
      where: filters,
      select: publicUserSelect,
      skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
      take: parseInt(limit, 10),
    });

    const totalUsers = await prisma.user.count({ where: filters });

    res.json({
      users,
      totalPages: Math.ceil(totalUsers / parseInt(limit, 10)),
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get a user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to update a user by ID
export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { fullName, phone, role, isActive } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (existingUser.role === "ADMIN" || role === "ADMIN") {
      return res.status(403).json({ error: "Admin accounts cannot be managed here" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { fullName, phone, role, isActive },
      select: publicUserSelect,
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to delete a user by ID
export const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (existingUser.role === "ADMIN") {
      return res.status(403).json({ error: "Admin accounts cannot be deleted" });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
