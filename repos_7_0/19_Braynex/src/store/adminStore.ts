// import { create } from "zustand";
// import { supabase } from "../utils/supabase";
// import toast from "react-hot-toast";
// import { NavigateFunction } from "react-router-dom";

// interface AdminStoreType {
//   admin: { [key: string]: any } | null;
//   setAdmin: (admin: { [key: string]: any } | null) => void;
//   isNull: boolean;
//   setIsNull: (value: boolean) => void;
//   navigate: NavigateFunction | null;
//   setNavigate: (navigate: NavigateFunction) => void;
//   isError: string;
//   setIsError: (value: string) => void;
//   login: (email: string, password: string) => Promise<any>;
//   logout: () => Promise<void>;
// }

// export const useAdminStore = create<AdminStoreType>((set, get) => ({
//   isNull: false,
//   setIsNull: (isNull) => set({ isNull }),
//   isError: "",
//   setIsError: (isError) => set({ isError }),
//   navigate: null,
//   setNavigate: (navigate) => set({ navigate }),
//   admin: null,
//   setAdmin: (admin) => set({ admin }),
//   login: async (email, password) => {
//     const navigate = get()?.navigate;
//     const loadingToast = toast.loading("Logging in...");
//     try {
//       const { data, error } = await supabase
//         .from("admin") // Query from the 'admin' table
//         .select("*") // Select all columns
//         .eq("email", email) // Filter where email matches the parameter
//         .single(); // Use `.single()` to get exactly one record (assuming email is unique)

//       if (data) {
//         if (data.password === password) {
//           set({ admin: data });
//           localStorage.setItem(
//             "currentLogin",
//             JSON.stringify({
//               role: "admin",
//               email,
//             })
//           );
//           toast.success("Logged in successfully", {
//             id: loadingToast,
//           });
//           navigate && navigate("/admin-dashboard");
//         } else {
//           set({ isError: "Password is incorrect" });
//           toast.error("Password is incorrect", {
//             id: loadingToast,
//           });
//         }
//       }
//     } catch (error) {
//       set({ isError: "Cannot Login Admin" });
//       toast.error("Cannot Login Admin", {
//         id: loadingToast,
//       });
//     }
//   },
//   logout: async () => {
//     set({ admin: null });
//     localStorage.removeItem("currentLogin");
//     toast.success("Logged out successfully",{});
//   },
// }));
