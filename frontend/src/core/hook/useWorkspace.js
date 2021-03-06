/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState, workspaceDetailState } from "core/state";
import { useAxios, useUser } from ".";
import { useLocation } from "react-router-dom";

export function useWorkspace() {
  const { user, setUser, getUsersByWorkspace } = useUser();
  const [workspaceDetail, setWorkspaceDetail] =
    useRecoilState(workspaceDetailState);
  const { customAxios } = useAxios();
  const location = useLocation();

  const join = async () => {
    console.debug("%c[워크스페이스 가입중..]", "color:#5499C7");

    const workspaceCode = window.prompt("초대코드를 입력해주세요. ✨");
    if (!workspaceCode) return false;

    const formData = new FormData();
    formData.append("workspaceCode", workspaceCode);
    formData.append("joinUserId", user.id);

    const res = await customAxios({
      method: "post",
      url: "/workspaces/invite",
      data: formData,
    });

    setUser({
      ...user,
      workspaces: res.workspaces,
    });
  };

  // 워크스페이스 생성
  const store = async () => {
    const workspaceName = window.prompt("워크스페이스 이름을 작성해주세요.");
    if (!workspaceName) return false;

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("name", workspaceName);

    const res = await customAxios({
      method: "post",
      url: "/workspaces",
      data: formData,
    });
    console.debug("%c[워크스페이스 생성중..]", "color:#5499C7");

    setUser({
      ...user,
      workspaces: res.workspaces,
    });
  };

  // 워크스페이스 수정
  const edit = async (workspace) => {
    const workspaceName = window.prompt(
      "수정할 워크스페이스 이름을 입력해주세요.",
      workspace.name
    );
    if (!workspaceName) return false;

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("workspaceName", workspaceName);

    console.debug("%c[워크스페이스 수정중..]", "color:#5499C7");

    await customAxios({
      method: "put",
      url: `/workspaces/${workspace.id}`,
      data: formData,
    });

    const newWorkspaces = user.workspaces.map((w) => {
      if (w.id === workspace.id) return { ...w, name: workspaceName };
      else return w;
    });

    setUser({
      ...user,
      workspaces: newWorkspaces,
    });
  };

  // 워크스페이스 삭제
  const destroy = async (workspaceId) => {
    const result = window.prompt(
      "워크스페이스를 삭제하려면 'DELETE'를 입력해주세요"
    );
    const rightAnswer = "DELETE";
    if (result !== rightAnswer) return false;

    console.debug("%c[워크스페이스 삭제중..]", "color:#5499C7");

    await customAxios({
      method: "delete",
      url: `/workspaces/${workspaceId}?userId=${user.id}`,
    });

    const newWorkspaces = user.workspaces.filter(
      (workspace) => workspace.id !== workspaceId
    );
    setUser({
      ...user,
      workspaces: newWorkspaces,
    });
  };

  const getWorksByWorkspace = async (workspaceCode) => {
    const { works } = await customAxios({
      method: "get",
      url: `/works?workspaceCode=${workspaceCode}`,
    });
    return works;
  };

  const workspaceDetailInit = async () => {
    let workspaceCode = location.pathname.split("workspaces/")[1];
    if (workspaceCode.includes("/"))
      workspaceCode = workspaceCode.split("/")[0];

    const users = await getUsersByWorkspace(workspaceCode);
    const works = await getWorksByWorkspace(workspaceCode);

    user.workspaces.forEach((workspace) => {
      if (workspace.code === workspaceCode) {
        setWorkspaceDetail({
          ...workspaceDetail,
          id: workspace.id,
          code: workspace.code,
          name: workspace.name,
          users: users,
          works: works,
        });
      }
    });
  };

  return {
    workspaceDetail,
    store,
    edit,
    destroy,
    join,
    workspaceDetailInit,
    getWorksByWorkspace,
  };
}

export function useSetWorkspaceDetail() {
  const [workspaceDetail, setWorkspaceDetail] =
    useRecoilState(workspaceDetailState);
  const user = useRecoilValue(userState);
  const { workspaceDetailInit } = useWorkspace();

  useEffect(() => {
    // 유저 아이디가 존재하고 워크스페이스 디테일 아이디가 없을 때
    if (user.id) {
      console.debug(
        "%c[워크스페이스 컬랙션중 선택한 워크스페이스 설정중..]",
        "color:blue"
      );
      workspaceDetailInit();
    }
  }, [user]);

  return { workspaceDetail, setWorkspaceDetail };
}
