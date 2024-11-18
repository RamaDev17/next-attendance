import axios from "axios";

export const checkAuth = async (): Promise<boolean> => {
  try {
    // Backend akan memvalidasi token yang ada di cookie
    await axios.get(`${process.env.NEXT_PUBLIC_BE_URL}/auth/validate`, {
      withCredentials: true, // Pastikan mengirimkan cookie
    });
    return true; // Token valid
  } catch {
    return false; // Token tidak valid
  }
};
