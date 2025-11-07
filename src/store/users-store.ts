import { create } from "zustand";
import { IUser } from "@/interfaces";

const useUsersStore = create((set) => ({
  users: [],
  setUsers: (payload: IUser) => set({ users: payload }),
}));

export default useUsersStore;

export interface IUserStore {
  users: IUser | null;
  setUsers: (payload: IUser) => void;
}
