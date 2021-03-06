import { userState } from "core/state";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useAxios, useEmojiToast } from "core/hook";

export function useUser() {
  const [user, setUser] = useRecoilState(userState);
  const { setEmojiToast } = useEmojiToast();
  const { customAxios } = useAxios();

  const getUsersByWorkspace = async (workspaceCode) => {
    console.debug("%c[Path에서 워크스페이스 코드 추출]", "color:gray");
    console.debug(workspaceCode);

    const { users } = await customAxios({
      method: "GET",
      url: `/users?workspaceCode=${workspaceCode}`,
    });
    return users;
  };

  const getUserDetailById = async (userId) => {
    const { user } = await customAxios({
      method: "get",
      url: `/users/${userId}`,
    });
    setUserDetail(user);
  };

  const setUserDetail = (user) => {
    setUser({
      ...user,
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      originImagePath: user.originImage,
      thumbnailImagePath: user.thumbnailImage,
      workspaces: user.workspaces,
      level: user.level,
      exp: user.exp,
    });
  };

  const updateUserLevel = async (exp) => {
    const formData = new FormData();
    formData.append("exp", exp);
    const res = await customAxios({
      method: "PUT",
      url: `/users/${user.id}/level-update`,
      data: formData,
    });

    setUser({
      ...user,
      level: res.user.level,
      exp: res.user.exp,
    });
  };

  const levelUpCheck = () => {
    console.debug(user.exp + 100 / user.level);
    if (user.exp + 100 / user.level >= 100) {
      setEmojiToast({
        open: true,
        type: "HAPPY",
        second: 5000,
        message: "레벨업!! 앞으로도 호호컴퍼니를 위해 열심히 굴러주세요 ^.^",
      });
      const notification = new Notification("투두잇", {
        body: `${user.nickname}님이 ${user.level + 1} 을 달성했어요~!`,
        // icon: bgImg,
      });
      setTimeout(notification.close.bind(notification), 5000);
    }
  };

  const editNickname = async () => {
    console.debug("%c[닉네임 수정중..]", "color:#F39C12");

    const newNickname = window.prompt(
      "바꿀 닉네임을 입력해주세요.",
      user.nickname
    );
    if (!newNickname) return false;

    const formData = new FormData();
    formData.append("nickname", newNickname);

    const { updateUserInfo } = await customAxios({
      method: "put",
      url: `/users/${user.id}`,
      data: formData,
    });

    setUser({
      ...user,
      nickname: updateUserInfo.nickname,
    });
  };

  const initProfileImage = async () => {
    console.debug("%c[이미지 파일 초기화중..]", "color:#F39C12");

    await customAxios({
      method: "put",
      url: `/users/${user.id}/profile-image-init`,
    });

    setUser({
      ...user,
      originImage: "",
      thumbnailImage: "",
    });
  };

  const storeProfileImage = async (file) => {
    console.debug("%c[이미지 파일 변경중..]", "color:#F39C12");

    const formData = new FormData();
    formData.append("profileImg", file);

    const { updateUserInfo } = await customAxios({
      method: "put",
      url: `/users/${user.id}`,
      data: formData,
    });

    setUser({
      ...user,
      originImagePath: updateUserInfo.originImage,
      thumbnailImagePath: updateUserInfo.thumbnailImage,
    });
  };

  return {
    user,
    setUser,
    getUserDetailById,
    initProfileImage,
    storeProfileImage,
    editNickname,
    updateUserLevel,
    getUsersByWorkspace,
    levelUpCheck,
  };
}

export function useUserLogout() {
  const navigate = useNavigate();
  const { customAxios } = useAxios();

  const logout = async () => {
    const res = await customAxios({
      method: "GET",
      url: "/users/logout",
    });
    console.debug(res);
    navigate("/");
  };

  return { logout };
}
