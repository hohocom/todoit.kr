import {
  ThemeContainer,
  ThemeMainBox,
  ThemeTitleBox,
} from "components/layout/theme";
import {
  WorkspaceCreateButton,
  WorkspaceJoinButton,
  WorkspaceList,
} from "components/layout/workspace";
import {
  UserNicknameEditButton,
  UserLogoutButton,
} from "components/layout/user";
import { ParticleContainer } from "components/layout";
import { Avatar, ImagePreview } from "components/common";
import { useSecure, useUser } from "core/hook";

function WorkspaceCollectionPage() {
  useSecure(); // use security ð
  const { user, initProfileImage, storeProfileImage } = useUser();

  return (
    <ThemeContainer>
      <ThemeTitleBox>
        <div className="font-shadow2">{user.nickname}ë</div>
        <div className="font-shadow2">íėíĐëëĪ!</div>
      </ThemeTitleBox>
      <ThemeMainBox>
        <div className="flex items-start justify-start w-full mb-4">
          <div className="flex flex-col items-center">
            <Avatar size={60} user={user} />
            <ImagePreview
              initImage={initProfileImage}
              storeImage={storeProfileImage}
            />
          </div>
          <div className="ml-2">
            <div className="flex items-center justify-start">
              <div className="mt-1 mr-2">{user.nickname}</div>
              <UserNicknameEditButton />
            </div>
            <div>{user.email}</div>
          </div>
        </div>
        <div className="w-full mb-4">
          <h2>ę°ėë ėíŽėĪíėīėĪ ( {user.workspaces.length} )</h2>
          <WorkspaceList />
        </div>
        <div className="flex items-center justify-between w-full mt-4">
          <WorkspaceJoinButton />
          <WorkspaceCreateButton />
        </div>
        <div className="w-full mt-6 text-right">
          <UserLogoutButton />
        </div>
      </ThemeMainBox>
      <ParticleContainer />
    </ThemeContainer>
  );
}

export default WorkspaceCollectionPage;
