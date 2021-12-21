import { atom, selector } from "recoil";

export const userState = atom({
  key: "userState",
  default: {
    id: "",
    email: "",
    nickname: "",
    originImage: "",
    thumbnailImage: "",
    level: 1,
    exp: 0,
    workspaces: [],
  },
});

export const loginUserSeletor = selector({
  key: "loginUserSeletor",
  get: ({ get }) => {
    get(userState);
    console.log("실행됨");
  },
});
