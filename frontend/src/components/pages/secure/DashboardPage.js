/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { workCreateModalState } from "states/work";
import { worksShowModalState } from "states/work";
import { workspaceDetailState } from "states/workspace";
import { workDetailState } from "states/work";
import { apiScaffold } from "utils/apis";

import WorkspaceContainer from "components/layout/WorkspaceContainer";
import WorkspaceLeftSide from "components/layout/WorkspaceLeftSide";
import WorkspaceMain from "components/layout/WorkspaceMain";
import WorkspaceHeader from "components/layout/WorkspaceHeader";
import WorkspaceSection from "components/layout/WorkspaceSection";
import WorkspaceRightSide from "components/layout/WorkspaceRightSide";
import WorkCreateModal from "components/domain/work/WorkCreateModal";
import WorksShowModal from "components/domain/work/WorksShowModal";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import SockJsClient from "react-stomp";
import withSecure from "components/domain/user/withSecure";
import useSetWorkspaceDetail from "components/domain/workspace/useSetWorkspaceDetail";
import checkWhite from "assets/images/check-white.png";
function DashboardPage() {
  useSetWorkspaceDetail();

  const websocket = useRef();

  const [workspaceDetail, setWorkspaceDetail] =
    useRecoilState(workspaceDetailState);
  const [workDetail, setWorkDetail] = useRecoilState(workDetailState);

  const [worksShowModal, setWorksShowModal] =
    useRecoilState(worksShowModalState);
  const [workCreateModal, setWorkCreateModal] =
    useRecoilState(workCreateModalState);

  const handleDateClick = (args) => {};
  const handleEventClick = (args) => {
    workspaceDetail.works.forEach((work) => {
      if (work.id === Number(args.event.id)) {
        setWorkDetail(work);
      }
    });
    setWorksShowModal(!worksShowModal);
  };

  useEffect(() => {
    console.log("먼저실행됨");
    if (workspaceDetail.id) {
      getWorks();
    }
  }, [workspaceDetail.id]);
  useEffect(() => {}, [workspaceDetail]);

  const getWorks = async () => {
    console.debug("getWorks");
    const res = await apiScaffold({
      method: "get",
      url: `/works?workspaceId=${workspaceDetail.id}`,
    });
    // console.log(res.works);
    // const works1 = [];
    // for (let i = 0; i < res.works.length; i++) {
    //   works1.push({
    //     id: res.works[i].id,
    //     title: res.works[i].title,
    //     content: res.works[i].content,
    //     start: res.works[i].start,
    //     end: res.works[i].end,
    //     color: res.works[i].color,
    //     isFinished: 0,
    //   });
    // }
    // console.debug(works1);
    setWorkspaceDetail({
      ...workspaceDetail,
      works: res.works,
    });
  };
  function renderEventContent(eventInfo) {
    console.log(eventInfo.event);
    let isChecked = false;
    workspaceDetail.works.forEach((work) => {
      if (work.id === eventInfo.event.id) {
        isChecked = work.isChecked;
      }
    });
    return (
      <div className="flex items-center">
        {isChecked ? (
          <div className="relative flex items-center justify-center w-4 h-4 ml-1 mr-1 bg-white rounded-full">
            <i
              className="fas fa-check"
              style={{
                color: `${eventInfo.event.backgroundColor}`,
              }}
            ></i>
          </div>
        ) : (
          <div className="relative flex items-center justify-center w-4 h-4 ml-1 mr-1 bg-white rounded-full"></div>
        )}
        <p className="mt-0.5">{eventInfo.event.title}</p>
      </div>
    );
  }
  return (
    <WorkspaceContainer>
      <WorkspaceLeftSide workspaceCode={workspaceDetail.code} />
      <WorkspaceMain>
        <WorkspaceHeader />
        <WorkspaceSection>
          <SockJsClient
            url={`${process.env.REACT_APP_API_URL}/start`}
            topics={["/topics/sendTo", "/topics/template", "/topics/api"]}
            onMessage={(msg) => {
              console.log(msg);
            }}
            ref={websocket}
          />
          <div className="w-full h-full font-apple-light">
            <FullCalendar
              customButtons={{
                myCustomButton: {
                  text: "일정추가",
                  click: function () {
                    setWorkCreateModal(!workCreateModal);
                  },
                },
              }}
              height="100%"
              headerToolbar={{
                left: "title,myCustomButton",
                // center: "",
                right: "prev,today,next",
                //  right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
              }}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              dateClick={handleDateClick} // 달력 클릭시 이벤트
              eventClick={handleEventClick} // 이벤트 클릭시 이벤트
              // dayMaxEvents={true} // 이벤트가 오버되면 높이 제한 (+ 몇 개식으로 표현)
              events={workspaceDetail.works}
              eventContent={renderEventContent}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              // yy
            />
          </div>
        </WorkspaceSection>
      </WorkspaceMain>
      <WorkspaceRightSide />

      <WorkCreateModal />
      <WorksShowModal />
    </WorkspaceContainer>
  );
}

export default withSecure(DashboardPage);
