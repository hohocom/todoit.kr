package kr.todoit.api.service;

import kr.todoit.api.domain.User;
import kr.todoit.api.domain.Workspace;
import kr.todoit.api.domain.WorkspaceGroup;
import kr.todoit.api.dto.*;
import kr.todoit.api.exception.CustomException;
import kr.todoit.api.exception.DefaultExceptionType;
import kr.todoit.api.repository.UserRepository;
import kr.todoit.api.repository.WorkspaceGroupRepository;
import kr.todoit.api.repository.WorkspaceRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class WorkspaceService {

    private WorkspaceRepository workspaceRepository;
    private WorkspaceGroupRepository workspaceGroupRepository;
    private UserService userService;
    private UserRepository userRepository;

    public WorkspaceFindResponse findWorkspacesByUser(User user) {
        List<WorkspaceGroup> workspaceGroups = workspaceGroupRepository.findAllByUser(user);
        return WorkspaceFindResponse.of(workspaceGroups);
    }

    public WorkspaceFindResponse findWorkspacesByUserId(Long id) {
        List<WorkspaceGroup> workspaceGroups = workspaceGroupRepository.findAllByUserId(id);
        return WorkspaceFindResponse.of(workspaceGroups);
    }

    public WorkspaceFindResponse createWorkspace(WorkspaceCreateRequest workspaceCreateRequest) {
        // workspace 생성
        String randomCode = UUID.randomUUID().toString();
        Workspace workspace = workspaceCreateRequest.toWorkspace(randomCode);
        workspaceRepository.save(workspace);

        User user = userService.findUserById(workspaceCreateRequest.getUserId());
        WorkspaceGroup workspaceGroup = workspaceCreateRequest.toWorkspaceGroup(user, workspace);
        workspaceGroupRepository.save(workspaceGroup);

        // workspace 리스트 뿌리기
        return findWorkspacesByUser(user);
    }

    public WorkspaceFindResponse joinWorkspace(WorkspaceJoinRequest workspaceJoinRequest) {
        Workspace workspace = workspaceRepository.findOneByCode(workspaceJoinRequest.getWorkspaceCode());
        if (workspace == null) throw new CustomException(DefaultExceptionType.NOT_FOUND_WORKSPACE);

        User user = userRepository.findUserById(workspaceJoinRequest.getJoinUserId());
        if (user == null) throw new CustomException(DefaultExceptionType.NOT_FOUND_USER);

        WorkspaceGroup workspaceGroup = workspaceGroupRepository.findOneByWorkspaceAndUser(workspace, user);
        if (workspaceGroup != null) throw new CustomException(DefaultExceptionType.DUPLICATE_WORKSPACE);

        workspaceGroup = WorkspaceGroup.builder()
                .user(user)
                .workspace(workspace)
                .role((byte) 3)
                .build();
        workspaceGroupRepository.save(workspaceGroup);

        return findWorkspacesByUser(user);
    }

    public void update(WorkspaceUpdateRequest workspaceUpdateRequest) {
        Workspace workspace = workspaceRepository.findOneById(workspaceUpdateRequest.getWorkspaceId());
        if (workspace == null) throw new CustomException(DefaultExceptionType.NOT_FOUND_WORKSPACE);

        workspace.setName(workspaceUpdateRequest.getWorkspaceName());
    }

    public void deleteById(Long id) {
        workspaceGroupRepository.deleteByWorkspaceId(id);
        workspaceRepository.deleteById(id);
    }

    public void exitWorkspace(WorkspaceExitRequest workspaceExitRequest, Long tokenId) {
        User exitUser = userRepository.findUserById(workspaceExitRequest.getMemberId());
        if (exitUser == null) throw new CustomException(DefaultExceptionType.NOT_FOUND_USER);

        Workspace workspace = workspaceRepository.findOneById(workspaceExitRequest.getWorkspaceId());
        if (workspace == null) throw new CustomException(DefaultExceptionType.NOT_FOUND_WORKSPACE);

        WorkspaceGroup workspaceGroup1 = workspaceGroupRepository.findOneByWorkspaceAndUser(workspace, exitUser);
        if (workspaceGroup1 == null) throw new CustomException((DefaultExceptionType.NOT_FOUND_WORKSPACE_GROUP));

        if (workspaceExitRequest.getSuperMemberId() != null) {
            User superUser = userRepository.findUserById(workspaceExitRequest.getSuperMemberId());
            if (superUser == null) throw new CustomException(DefaultExceptionType.NOT_FOUND_USER);

            WorkspaceGroup workspaceGroup2 = workspaceGroupRepository.findOneByWorkspaceAndUser(workspace, superUser);
            if (workspaceGroup2 == null) throw new CustomException((DefaultExceptionType.NOT_FOUND_WORKSPACE_GROUP));

            if (workspace == null) throw new CustomException(DefaultExceptionType.NOT_FOUND_WORKSPACE);

            if (
                tokenId == superUser.getId() &&
                workspaceGroup1.getWorkspace().getId() == workspaceGroup2.getWorkspace().getId() &&
                (workspaceGroup2.getRole() == 1 || workspaceGroup2.getRole() == 2)
            ) {
                workspaceGroupRepository.deleteByUserAndWorkspace(exitUser, workspace);
            } else {
                throw new CustomException((DefaultExceptionType.AUTHENTICATE_NOT_MATCH));
            }
        } else if (exitUser.getId() == tokenId) {
            workspaceGroupRepository.deleteByUserAndWorkspace(exitUser, workspace);
        } else {
            throw new CustomException((DefaultExceptionType.AUTHENTICATE_NOT_MATCH));
        }
    }
}
