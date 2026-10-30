// import { create } from "zustand";
// import { supabase } from "../utils/supabase";
// import toast from "react-hot-toast";
// import { NavigateFunction } from "react-router-dom";

// interface MentorStoreType {
//   mentors: [{ [key: string]: any }] | null;
//   setMentors: (mentors: [{ [key: string]: any }] | null) => void;
//   isNull: boolean;
//   setIsNull: (value: boolean) => void;
//   isError: string;
//   setIsError: (value: string) => void;
//   mentor: { [key: string]: any } | null;
//   setMentor: (mentor: { [key: string]: any } | null) => void;
//   createMentor: (mentor: { [key: string]: any }) => Promise<any>;
//   updateMentor: (mentor: { [key: string]: any }) => Promise<any>;
//   deleteMentor: (id: string) => Promise<any>;
//   getMentors: () => Promise<any>;
//   getMentor: (id: string) => Promise<any>;
// }

// export const useMentorStore = create<MentorStoreType>((set, get) => ({
//   mentors: null,
//   setMentors: (mentors) => set({ mentors }),
//   isNull: false,
//   setIsNull: (isNull) => set({ isNull }),
//   isError: "",
//   setIsError: (isError) => set({ isError }),
//   mentor: null,
//   setMentor: (mentor) => set({ mentor }),
//   createMentor: async (mentor) => {
//     const loadingToast = toast.loading("Creating Mentor...");
//     try {
//       const createMentor = await supabase
//         .from("mentor")
//         .insert([mentor])
//         .single();
//       const createMentorSkills = await supabase.from("mentor_skill").insert([
//         mentor.skills.map((skill: string) => ({
//           mentor_id: mentor.id,
//           skill_id: skill,
//         })),
//       ]);

//       if (createMentor.data && createMentorSkills) {
//         set({ mentor: (createMentor as any).data && createMentorSkills });
//         toast.success("Mentor created successfully", {
//           id: loadingToast,
//         });
//       } else {
//         set({ isError: "Cannot create Mentor" });
//         toast.error("Cannot create Mentor", {
//           id: loadingToast,
//         });
//       }
//     } catch (error) {
//       set({ isError: "Cannot create Mentor" });
//       toast.error("Cannot create Mentor", {
//         id: loadingToast,
//       });
//     }
//   },
//   updateMentor: async (mentor) => {
//     const loadingToast = toast.loading("Updating Mentor...");
//     try {
//       const updateMentor = await supabase
//         .from("mentor")
//         .update(mentor)
//         .match({ id: mentor.id });
//       const deleteMentorSkill = await supabase
//         .from("mentor_skill")
//         .delete()
//         .match({ mentor_id: mentor.id });
//       const createMentorSkills = await supabase.from("mentor_skill").insert([
//         mentor.skills.map((skill: string) => ({
//           mentor_id: mentor.id,
//           skill_id: skill,
//         })),
//       ]);
//       if (
//         updateMentor.data &&
//         deleteMentorSkill.data &&
//         createMentorSkills.data
//       ) {
//         set({
//           mentor: updateMentor.data,
//         });
//         toast.success("Mentor updated successfully", {
//           id: loadingToast,
//         });
//       } else {
//         set({ isError: "Cannot update Mentor" });
//         toast.error("Cannot update Mentor", {
//           id: loadingToast,
//         });
//       }
//     } catch (error) {
//       set({ isError: "Cannot update Mentor" });
//       toast.error("Cannot update Mentor", {
//         id: loadingToast,
//       });
//     }
//   },
//   deleteMentor: async (id) => {
//     const loadingToast = toast.loading("Deleting Mentor...");
//     try {
//       const deleteMentor = await supabase.from("mentor").delete().match({ id });
//       const deleteMentorSkill = await supabase
//         .from("mentor_skill")
//         .delete()
//         .match({ mentor_id: id });

//       if (deleteMentor.data && deleteMentorSkill.data) {
//         set({ mentor: null });
//         toast.success("Mentor deleted successfully", {
//           id: loadingToast,
//         });
//       } else {
//         set({ isError: "Cannot delete Mentor" });
//         toast.error("Cannot delete Mentor", {
//           id: loadingToast,
//         });
//       }
//     } catch (error) {
//       set({ isError: "Cannot delete Mentor" });
//       toast.error("Cannot delete Mentor", {
//         id: loadingToast,
//       });
//     }
//   },
//   getMentors: async () => {
//     const loadingToast = toast.loading("Fetching Mentors...");
//     try {
//       const { data, error } = await supabase.from("mentor").select(`
//           *,
//           mentor_skill (
//             skill (id, name)
//           )
//         `);

//       const mentorsWithSkills = data?.map((mentor) => ({
//         ...mentor,
//         skills: mentor.mentor_skill.map(
//           (ms: { [value: string]: any }) => ms.skill
//         ),
//       }));

//       if (data) {
//         set({ mentors: mentorsWithSkills as any });
//         toast.success("Fetched Mentors successfully", {
//           id: loadingToast,
//         });
//       } else {
//         set({ isError: "Cannot fetch Mentors" });
//         toast.error("Cannot fetch Mentors", {
//           id: loadingToast,
//         });
//       }
//     } catch (error) {
//       set({ isError: "Cannot fetch Mentors" });
//       toast.error("Cannot fetch Mentors", {
//         id: loadingToast,
//       });
//     }
//   },
//   getMentor: async (id) => {
//     const loadingToast = toast.loading("Fetching Mentor...");
//     try {
//       const { data, error } = await supabase
//         .from("mentor")
//         .select(
//           `
//           *,
//           mentor_skill (
//             skill (id, name)
//           )
//         `
//         )
//         .match({ id })
//         .single();

//       if (error) throw error;

//       const mentorWithSkills = {
//         ...data,
//         skills: data.mentor_skill.map(
//           (ms: { [value: string]: any }) => ms.skill
//         ),
//       };

//       if (data) {
//         set({ mentor: mentorWithSkills });
//         toast.success("Fetched Mentor successfully", {
//           id: loadingToast,
//         });
//       } else {
//         set({ isError: "Cannot fetch Mentor" });
//         toast.error("Cannot fetch Mentor", {
//           id: loadingToast,
//         });
//       }
//     } catch (error) {
//       set({ isError: "Cannot fetch Mentor" });
//       toast.error("Cannot fetch Mentor", {
//         id: loadingToast,
//       });
//     }
//   },
// }));
