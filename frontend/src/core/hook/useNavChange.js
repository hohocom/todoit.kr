/* eslint-disable react-hooks/exhaustive-deps */
import { workspaceDetailState, workspaceUIState } from "core/state";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

export function useNavChange() {
  const workspaceDetail = useRecoilValue(workspaceDetailState);
  const [workspaceUI, setWorksaceUI] = useRecoilState(workspaceUIState);

  useEffect(() => {
    console.debug(
      "%c[워크스페이스 매뉴 -> code에 맞게 재구성중..]",
      "color:#45B39D"
    );
    setWorksaceUI({
      ...workspaceUI,
      menus: [
        {
          id: 1,
          title: "일정 관리",
          url: `/workspaces/${workspaceDetail.code}`,
          icon: <i className="fab fa-bandcamp text-xl  mr-0.5"></i>,
        },
        {
          id: 2,
          title: "인사 관리",
          url: `/workspaces/${workspaceDetail.code}/members`,
          icon: <i className="text-xl fas fa-address-card "></i>,
        },
      ],
    });
  }, [workspaceDetail.code]);

  const changeMenu = (index) => {
    const menu = {
      id: index,
    };
    window.localStorage.setItem("workspaceMenuIndex", JSON.stringify(menu));
  };

  const getMenuIndex = () => {
    const workspaceMenuIndexString =
      window.localStorage.getItem("workspaceMenuIndex");
    if (!workspaceMenuIndexString) return 1;

    const { id } = JSON.parse(workspaceMenuIndexString);
    return id;
  };

  return { workspaceUI, changeMenu, getMenuIndex };
}
