import { db } from './db'; // Prisma Client instance from db.ts

// Create a new user
export async function createUser(username: string, hashedPassword: string, email?: string) {
  try {
    const newUser = await db.user.create({
      data: {
        username,
        hashedPassword,
        email,
      },
    });
    console.log('User created successfully:', newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

// Fetch a user by ID
export async function getUserById(id: number) {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Failed to fetch user by ID');
  }
}

// Fetch a user by email
export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Failed to fetch user by email');
  }
}

// Fetch all users
export async function getAllUsers() {
  try {
    const users = await db.user.findMany();
    return users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('Failed to fetch users');
  }
}

// Update a user's information
export async function updateUser(id: number, data: Partial<{ username: string; email?: string; hashedPassword?: string }>) {
  try {
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data,
    });
    console.log('User updated successfully:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

// Delete a user by ID
export async function deleteUser(id: number) {
  try {
    const deletedUser = await db.user.delete({
      where: {
        id,
      },
    });
    console.log('User deleted successfully:', deletedUser);
    return deletedUser;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}
