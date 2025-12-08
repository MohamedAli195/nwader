import { createSlice } from "@reduxjs/toolkit";
import i18n from "../../components/i18n/i18n";

const initialState = {
  language: localStorage.getItem("language") || "ar",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
      i18n.changeLanguage(action.payload); // ✅ تحديث اللغة فورًا
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
