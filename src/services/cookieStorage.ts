// utils/cookieStorage.ts
import Cookies from "js-cookie";

const cookieStorage = {
  getItem: (key: string): Promise<string | null> =>
    Promise.resolve(Cookies.get(key) || null),

  setItem: (key: string, value: string): Promise<void> => {
    Cookies.set(key, value, {
      expires: 4,
      sameSite: "Strict",
      secure: true,
    });
    return Promise.resolve();
  },

  removeItem: (key: string): Promise<void> => {
    Cookies.remove(key);
    return Promise.resolve();
  },
};

export default cookieStorage;
