/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiScaffold } from "utils/apis";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userState } from "states/user";
import ThemeContainer from "components/layout/ThemeContainer";
import ParticlesContainer from "components/layout/ParticlesContainer";

function LoginKakoRedirectPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [user, setUser] = useRecoilState(userState);

  useEffect(async () => {
    const kakaoAccessToken = await getKakaoAccessToken();
    console.debug(kakaoAccessToken)
    const { id } = await getTotoitAccessToken(kakaoAccessToken);
    const res = await getUserInfo(id);
    setUser({
      ...user,
      id: res.user.id,
      email: res.user.email,
      nickname: res.user.nickname,
      workspaces: res.user.workspaces,
    });
    navigate("/workspaces");
  }, []);

  const getKakaoAccessToken = async () => {
    const code = search.split("code=")[1];
    console.log(code);
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.REACT_APP_KAKAO_CLIENT_ID);
    params.append("redirect_uri", process.env.REACT_APP_KAKAO_REDIRECT_URL);
    params.append("code", code);

    const kakaoRes = await axios({
      method: "post",
      url: "https://kauth.kakao.com/oauth/token",
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      withCredentials: false,
      data: params,
    })
      .then((data) => data.data)
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === 500 || err.response.status === 400) {
          window.alert("카카오 서버요청이 정상적으로 처리되지 않았습니다.");
          navigate("/login");
          throw new Error("요청 에러");
        }
      });

    return kakaoRes.access_token;
  };

  const getTotoitAccessToken = async (kakaoAccessToken) => {
    const formData = new FormData();
    formData.append("providerType", "KAKAO");
    formData.append("accessToken", kakaoAccessToken);
    const res = await axios({
      method: "post",
      url: "/users/login-by-oauth",
      data: formData,
    })
      .then((data) => data.data)
      .catch((err) => {
        window.alert(
          "투두잇 서버요청에 문제가 발생하였습니다.\n잠시후 다시 시도해주세요."
        );
        navigate("/login");
        throw new Error(err);
      });

    console.debug(res);
    axios.defaults.headers.common["Authorization"] = `bearer ${res.act.token}`;
    return res.act;
  };

  const getUserInfo = async (userId) => {
    const res = await apiScaffold({
      method: "get",
      url: `/users/${userId}`,
    });
    console.debug(res);
    return res;
  };

  return (
    <ThemeContainer>
      <ParticlesContainer />
    </ThemeContainer>
  );
}

export default LoginKakoRedirectPage;
