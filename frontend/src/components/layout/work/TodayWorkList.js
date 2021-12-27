import { CheckBox } from "components/common";
import { useUser, useWork } from "core/hook";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { workDetailModalState, workspaceDetailState } from "core/state";
// import notFoundWork from "assets/images/notFoundWork.png";
import todayMyWorkImg from "assets/images/todayMyWork.svg";
import { useRef } from "react";

function TodayWorkList() {
  const workspaceDetail = useRecoilValue(workspaceDetailState);
  const { editFinished } = useWork();
  const { user, getUserDetailById } = useUser();
  const setWorkDetailModal = useSetRecoilState(workDetailModalState);
  const worksRef = useRef();

  const handleEventClick = (id) => {
    workspaceDetail.works.forEach((work) => {
      if (work.id === id) {
        console.debug("%c[일정 디테일 설정중..],", "color:red");
        console.debug(work);
        setWorkDetailModal({
          isOpen: true,
          id: work.id,
          title: work.title,
          content: work.content,
          themeColor: work.color,
          isFinished: work.isFinished,
          workers: work.users,
          startDate: work.start,
          endDate: work.end,
        });
      }
    });
  };

  return (
    <div className="absolute bottom-0 left-0 w-full p-4">
      <div className="flex flex-col items-center h-[450px]">
        <div className="w-full mb-2 text-base font-apple-bold">Today Works</div>
        <div
          ref={worksRef}
          id="todayMyWorks"
          className="w-full overflow-y-auto custom-scroll"
        >
          {workspaceDetail.works.map((work) => {
            const startTimestamp = new Date(work.start).getTime();
            const endTimestamp = new Date(work.end).getTime();
            const todayTimestamp = new Date().getTime();
            console.debug(startTimestamp >= todayTimestamp);
            console.debug(todayTimestamp <= endTimestamp);

            return work.users.map((u) => {
              const isTodayMyWork =
                u.id === user.id &&
                startTimestamp <= todayTimestamp &&
                todayTimestamp <= endTimestamp;

              if (isTodayMyWork) {
                return (
                  <div className="flex justify-center" key={work.id}>
                    <div className="z-10 flex items-center justify-between w-full p-4 mb-4 bg-gray-100 rounded-lg box-shadow2">
                      <div
                        className="flex flex-col cursor-pointer"
                        onClick={() => handleEventClick(work.id)}
                      >
                        <p className="font-apple-bold max-h-[30px] overflow-hidden">
                          {work.title}
                        </p>
                        <p className="text-sm text-gray-500 font-apple-bold max-h-[30px] overflow-hidden">
                          {work.content}
                        </p>
                      </div>
                      <div className="min-w-[50px] flex justify-end">
                        <CheckBox
                          value={Number(work.isFinished)}
                          changeEvent={async () => {
                            await editFinished(
                              work.id,
                              Number(work.isFinished) === 0 ? 1 : 0
                            );
                            await getUserDetailById(user.id);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            });
          })}
        </div>
        <div className="absolute flex flex-col items-center w-10/12 top-[50px] z-0">
          <img src={todayMyWorkImg} alt="img" className="w-full" />
        </div>
      </div>
    </div>
  );
}

export default TodayWorkList;
