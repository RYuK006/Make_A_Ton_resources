// import { create } from "zustand";
// import { supabase } from "../utils/supabase";
// import toast from "react-hot-toast";

// interface CareerStoreType {
//   careers: [{ [key: string]: any }] | null;
//   setCareers: (careers: [{ [key: string]: any }] | null) => void;
//   isNull: boolean;
//   setIsNull: (value: boolean) => void;
//   isError: string;
//   setIsError: (value: string) => void;
//   career: { [key: string]: any } | null;
//   setCareer: (career: { [key: string]: any } | null) => void;
//   createCareer: (career: { [key: string]: any }) => Promise<any>;
//   updateCareer: (career: { [key: string]: any }) => Promise<any>;
//   deleteCareer: (id: string) => Promise<any>;
//   getCareers: () => Promise<any>;
//   getCareer: (id: string) => Promise<any>;
// }

// export const useCareerStore = create<CareerStoreType>((set) => ({
//   careers: null,
//   setCareers: (careers) => set({ careers }),
//   isNull: false,
//   setIsNull: (isNull) => set({ isNull }),
//   isError: "",
//   setIsError: (isError) => set({ isError }),
//   career: null,
//   setCareer: (career) => set({ career }),
//   createCareer: async (career) => {
//     const loadingToast = toast.loading("Creating Career...");
//     try {
//       const { data, error } = await supabase.from("career").insert([career]);
//       if (data) {
//         set({ career: data });
//         toast.success("Career created successfully", {
//           id: loadingToast,
//         });
//       }
//     } catch (error) {
//       set({ isError: "Cannot create Career" });
//       toast.error("Cannot create Career", {
//         id: loadingToast,
//       });
//     }
//   },
//   updateCareer: async (career) => {
//     const loadingToast = toast.loading("Updating Career...");
//     try {
//       const { data, error } = await supabase
//         .from("career")
//         .update(career)
//         .match({ id: career.id });
//       if (data) {
//         set({ career: data });
//         toast.success("Career updated successfully", {
//           id: loadingToast,
//         });
//       }
//     } catch (error) {
//       set({ isError: "Cannot update Career" });
//       toast.error("Cannot update Career", {
//         id: loadingToast,
//       });
//     }
//   },
//   deleteCareer: async (id) => {
//     const loadingToast = toast.loading("Deleting Career...");
//     try {
//       const { data, error } = await supabase
//         .from("career")
//         .delete()
//         .match({ id });
//       if (data) {
//         set({ career: data });
//         toast.success("Career deleted successfully", {
//           id: loadingToast,
//         });
//       }
//     } catch (error) {
//       set({ isError: "Cannot delete Career" });
//       toast.error("Cannot delete Career", {
//         id: loadingToast,
//       });
//     }
//   },
//   getCareers: async () => {
//     const loadingToast = toast.loading("Fetching Careers...");
//     try {
//       const { data, error } = await supabase.from("career").select("*");
//       if (data) {
//         set({ careers: data as any });
//         toast.success("Fetched Careers successfully", {
//           id: loadingToast,
//         });
//       }
//     } catch (error) {
//       set({ isError: "Cannot fetch Careers" });
//       toast.error("Cannot fetch Careers", {
//         id: loadingToast,
//       });
//     }
//   },
//   getCareer: async (id) => {
//     const loadingToast = toast.loading("Fetching Career...");
//     try {
//       const { data, error } = await supabase
//         .from("career")
//         .select("*")
//         .match({ id });
//       if (data) {
//         set({ career: data });
//         toast.success("Fetched Career successfully", {
//           id: loadingToast,
//         });
//       }
//     } catch (error) {
//       set({ isError: "Cannot fetch Career" });
//       toast.error("Cannot fetch Career", {
//         id: loadingToast,
//       });
//     }
//   },
// }));
