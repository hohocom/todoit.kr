import { useEffect, useState } from 'react'

import bgImg from '../../assets/images/bg.jpg'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css'
import CalendarCreateModal from '../widgets/stateful/calendar/CalendarCreateModal'
import CalendarShowModal from '../widgets/stateful/calendar/CalendarShowModal'
import AvatarGroup from '../widgets/stateless/AvatarGroup'
import { workspaceDetail, workspaceDetailState } from '../../states/workspace'
import { userState } from '../../states/user'
import { useRecoilState, useRecoilValue } from 'recoil'
import { apiScaffold, refreshToken } from '../../utils/apis'
import { useLocation } from 'react-router'

function WorkspaceLayout({ children }) {
  const [user, setUser] = useRecoilState(userState)
  const [workspaceDetail, setWorkspaceDetail] = useRecoilState(
    workspaceDetailState,
  )

  const location = useLocation()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    // console.debug(user)
    // 새로고침되었을 때 토큰 재발급
    const { userId } = await refreshToken()
    // 유저 정보 가져오기
    await getUserInfoThenSetUserState(userId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const workspaceCode = location.pathname.split('workspaces/')[1]
    // console.debug(workspaceCode)
    user.workspaces.map((workspace) => {
      console.log(workspace.code)
      if (workspaceCode === workspace.code) {
        setWorkspaceDetail({
          ...workspaceDetail,
          id: workspace.id,
          name: workspace.name,
          code: workspace.code,
        })
      }
    })
  }, [])

  const getUserInfoThenSetUserState = async (userId) => {
    const res = await apiScaffold({
      method: 'get',
      url: `/users/${userId}`,
    })

    console.debug(res)

    setUser({
      ...user,
      id: res.user.id,
      email: res.user.email,
      nickname: res.user.nickname,
      workspaces: res.user.workspaces,
    })
  }

  return (
    <div className="fixed top-0 left-0 flex w-full h-full font-apple-light">
      <aside className="min-w-[300px] h-full border-r border-gray-300">
        <figure className="w-full p-10">LOGO</figure>
      </aside>
      <main className="relative flex-col w-full h-full">
        <header className="w-full h-[60px] border-b flex justify-between items-center p-4">
          <h2 className="font-apple-bold">{workspaceDetail.name}</h2>

          <AvatarGroup
            items={[
              {
                thumbnailImage: bgImg,
              },
              {
                thumbnailImage: bgImg,
              },
              {
                thumbnailImage: bgImg,
              },
            ]}
          />
        </header>
        <section className="w-full h-full   pb-[100px] ">{children}</section>
      </main>
      <aside className="min-w-[350px] h-full border-l">
        <div className="w-full h-full bg-[#F2F2F2]  flex flex-col justify-start  p-[30px]">
          <div className="flex items-center justify-between w-full px-2 py-10">
            <i className="far fa-bell text-[#FF9E5D] text-3xl"></i>
            <i className="far fa-bell text-[#FF9E5D] text-3xl"></i>
          </div>
          <div className="flex flex-col items-center justify-center w-full bg-white rounded-3xl box-shadow1">
            <div className="w-[120px] h-[120px] rounded-full -mt-7 flex items-center justify-center border-4 border-rainbow-1">
              <img
                src={bgImg}
                alt="img"
                className="w-[100px] h-[100px] rounded-full"
              />
            </div>
            <div className="mt-4 text-xl text-black font-apple-hard">
              고재범
            </div>
            <div className="text-base text-gray-600 font-apple-bold">
              Developer
            </div>

            <div className="flex flex-col items-center justify-start w-full pl-5">
              <div className="mt-2 -mb-1 text-base text-black font-apple-bold w-[80%]">
                2 LVL
              </div>
              <div className="flex items-center justify-center w-[80%]">
                <div
                  id="lv-progress"
                  className="h-[20px] border border-[#FF9E5D] rounded-3xl w-full overflow-hidden"
                >
                  <div className="w-[40%] h-full bg-[#FF9E5D] transition-all delay-200"></div>
                </div>
                <div className="mt-1 ml-2 text-base text-black font-apple-bold">
                  40%
                </div>
              </div>
            </div>

            <div className="flex my-6 ">
              <div className="flex flex-col items-center border-r border-[#FF9E5D] px-5 pb-3">
                <div className="font-apple-bold text-xl text-[#FF9E5D] pb-3">
                  작성한 일정
                </div>
                <div className="text-3xl font-apple-hard">30</div>
              </div>
              <div className="flex flex-col items-center px-5">
                <div className="font-apple-bold text-xl text-[#FF9E5D] pb-3">
                  작성한 일정
                </div>
                <div className="text-3xl font-apple-hard">27</div>
              </div>
            </div>
          </div>
          <div className="mt-10 mb-6">
            <div className="text-base font-apple-bold">TODAY</div>
            <div className="flex items-center mt-1 text-base">
              <p className="text-lg font-apple-bold">재범</p>님 즐거운
              아침이에요 :) 🍀
            </div>
          </div>
          <div>
            <div className="w-[100%] h-[100px] bg-white flex items-center p-5 rounded-2xl mb-5 box-shadow2">
              <div className="flex items-center">
                <div className="w-16 h-16  bg-[#FFB45E] rounded-full"></div>
                <div className="flex flex-col ml-4">
                  <p className="font-apple-bold ">제안서 디자인 PPT</p>
                  <p className="text-sm text-gray-500 font-apple-bold">
                    UI에 들어갈 페이지 리디자인
                  </p>
                </div>
              </div>
            </div>

            <div className="w-[100%] h-[100px] bg-white flex items-center p-5 rounded-2xl box-shadow2">
              <div className="flex items-center">
                <div className="w-16 h-16  bg-[#FFB45E] rounded-full"></div>
                <div className="flex flex-col ml-4">
                  <p className="font-apple-bold ">제안서 디자인 PPT</p>
                  <p className="text-sm text-gray-500 font-apple-bold">
                    UI에 들어갈 페이지 리디자인
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <CalendarCreateModal />
      <CalendarShowModal />
    </div>
  )
}

export default WorkspaceLayout