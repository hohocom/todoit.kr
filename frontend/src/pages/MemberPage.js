import {
  WorkspaceContainer,
  WorkspaceLeftSide,
  WorkspaceRightSide,
  WorkspaceMain,
  WorkspaceHeader,
  WorkspaceSection,
} from "components/layout/workspace";
import { useSecure, useSetWorkspaceDetail } from "core/hook";
 
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "core/state";
import customAxios from "core/api";
import noneImg1 from "assets/images/noneImg1.png";
import noneImg2 from "assets/images/noneImg2.png";
import noneImg3 from "assets/images/noneImg3.png";
import noneImg4 from "assets/images/noneImg4.png";
import noneImg5 from "assets/images/noneImg5.png";
import noneImg6 from "assets/images/noneImg6.png";
import noneImg7 from "assets/images/noneImg7.png";
import noneImg8 from "assets/images/noneImg8.png";
import noneImg9 from "assets/images/noneImg9.png";
function MemberPage() {
  const noneImg = [noneImg1,noneImg2,noneImg3,noneImg4,noneImg5,noneImg6,noneImg7,noneImg8,noneImg9]
  const currentUser = useRecoilValue(userState);
  const { workspaceDetail } = useSetWorkspaceDetail(); //워크스페이스 정보 가져오기
  const [currentUserRole, setCurrentUserRole] = useState(false); // 현재 로그인한 유저 권한

  const [usersData, setUsersData] = useState([]); // 모든 user
  const userDataLength = workspaceDetail.users.length; //총 유저수
  const pageLimit = 10; // 한화면에 보여줄 유저 수
  const totalPageNumber = Math.ceil(userDataLength / pageLimit); //총 페이지수
  const [currentPageNumber, setCurrentPageNumber] = useState(1); // 현재 페이지 수
  // 현재 워크스페이스에 로그인한 유저 권한 가져오기
  const getRole = () => {
    workspaceDetail.users.map((user) => {
      if (user.id === currentUser.id) {
        if (user.role === 1 || user.role === 2) {
          setCurrentUserRole(true);
        }
      }
    });
  };

  const getAllUserData = async () => {
    // 워크스페이스에 해당하는 유저 10명씩 불러오기
    const { users } = await customAxios({
      method: "GET",
      url: `users?workspaceCode=${workspaceDetail.code}&pageNumber=${currentPageNumber}`,
    });
    setUsersData(users);
  };
  //유저 역할
  const role = (num) => {
    const roleText = ["관리자", "매니저", "일반"]; // 1 관리자 2 매니저 3 일반
    return roleText[num - 1];
  };
  //페이지 교체
  const setPage = (num) => {
    setCurrentPageNumber(num);
  };
  useEffect(() => {
    getAllUserData();
    getRole();
  }, []);
  useEffect(() => {
    console.log("currentpagenumber 바뀜");
    getAllUserData();
  }, [currentPageNumber]);
  const userExit = async (num) => {
    const formData = new FormData();
    formData.append("memberId", num);
    formData.append("workspaceId", workspaceDetail.id);
    formData.append("superMemberId", currentUser.id);
    await customAxios({
      method: "delete",
      url: "/workspaces/exit",
      data: formData,
    });
    getAllUserData();
  };

  useSecure(); 

  return (
    <WorkspaceContainer>
      <WorkspaceLeftSide />
      <WorkspaceMain>
        <WorkspaceHeader />
        <WorkspaceSection>
          <div className="flex flex-col  w-full ">
            <div className=" w-full h-14 flex items-center border-b">
              <div className="flex  justify-between  w-full font-noto-regular">
                <div className="flex justify-center w-44 ">프로필</div>
                <div className="flex justify-center w-36  ">레벨</div>
                <div className="flex justify-center w-40 ">역할</div>
                <div className="flex justify-center w-40 ">가입날짜</div>
                <div className="flex justify-center w-40 "></div>
              </div>
            </div>
            {usersData.map((user) => {
              return (
                <div
                  className=" w-full h-14 flex items-center border-b hover:bg-[#ffd3a994]   "
                  key={user.id}
                >
                  <div className="flex  justify-between  items-center w-full ">
                    <div className="flex items-center  w-44  pl-4 ">
                      <div className="relative">
                         <img
                          src={user.img ? process.env.REACT_APP_API_URL+"/images"+user.img : noneImg[(user.id%noneImg.length)]}
                          className=" w-10 h-10 rounded-full mr-2 bg-gray-200"
                        />
                        <div className="absolute top-[28px] left-[28px]   ">
                          <div className=" w-3 h-3 rounded-full bg-white"></div>
                          <div className="absolute top-[1.5px] left-[1.5px] w-[8.8px] h-[8.8px] rounded-full bg-green-500"></div>
                        </div>
                      </div>
                      <div>{user.nickname}</div>
                    </div>
                    <div className="flex justify-center w-36  ">
                      {user.level}
                    </div>
                    <div className="flex justify-center w-40 ">
                      {role(user.role)}
                    </div>
                    <div className="flex justify-center w-40 ">
                      {user.createdAt.substring(0, 10)}
                    </div>
                    <div className="flex justify-center w-40 ">
                      <button className="mr-4  rounded-md px-2 "></button>
                      {currentUserRole &&
                      !(user.id === currentUser.id) &&
                      !(user.role === 1) ? (
                        <button
                          className=" rounded-md px-2 text-red-500"
                          onClick={() => {
                            userExit(user.id);
                          }}
                        >
                          삭제
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="flex w-full  h-10  justify-center mt-1 items-baseline pt-2 cursor-pointer font-apple-bold">
              <div
                className="mr-3"
                onClick={() => {
                  setPage(1);
                }}
              >
                &lt;
              </div>
              {Array.from(Array(totalPageNumber), (e, i) => {
                if (i + 1 === currentPageNumber) {
                  return (
                    <div
                      className="mr-3 font-apple-bold cursor-pointer border-b border-black"
                      key={i}
                      onClick={() => {
                        setPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="mr-3 font-apple-regular cursor-pointer hover:font-apple-bold "
                      key={i}
                      onClick={() => {
                        setPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </div>
                  );
                }
              })}
              <div
                className="mr-3 cursor-pointer"
                onClick={() => {
                  setPage(totalPageNumber);
                }}
              >
                &gt;
              </div>
              
            </div>
          </div>
        </WorkspaceSection>
      </WorkspaceMain>
      <WorkspaceRightSide />
    </WorkspaceContainer>
  );
}

export default MemberPage;
