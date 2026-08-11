import { supabase } from "../lib/supabase";


// Register employee
export const registerEmployee = async (
  email,
  password,
  name
) => {
  const {
    data,
    error,
  } = await supabase.auth.signUp({
    email,
    password,

    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error(
      "User registration failed"
    );
  }

  return data;
};


// Login
export const loginUser = async (
  email,
  password
) => {
  const {
    data,
    error,
  } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    throw error;
  }

  return data;
};


// Logout
export const logoutUser = async () => {
  const {
    error,
  } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};


// Get current session
export const getCurrentSession = async () => {
  const {
    data,
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
};