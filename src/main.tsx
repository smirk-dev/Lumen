
import { createRoot } from "react-dom/client";
import SimpleTest from "./SimpleTest.tsx";
// import App from "./App.tsx";
import "./index.css";
// import { ClerkProvider } from "@clerk/clerk-react";

// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// if (!PUBLISHABLE_KEY) {
//   throw new Error("Missing Clerk Publishable Key");
// }

createRoot(document.getElementById("root")!).render(
  <SimpleTest />
  // <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
  //   <App />
  // </ClerkProvider>
);
  