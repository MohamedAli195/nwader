import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { RouterProvider } from "react-router";
import router from "./routes/index.tsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./components/i18n/i18n.ts";
import "react-datepicker/dist/react-datepicker.css";
import { persistor, store } from "./app/store.ts";
import { Toaster } from "react-hot-toast"; // إضافة التوستر
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
        <AppWrapper>
          <Toaster position="bottom-right" reverseOrder={false} />
          <RouterProvider router={router} />
        </AppWrapper>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
