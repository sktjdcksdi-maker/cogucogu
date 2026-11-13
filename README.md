# COGU TV — 나만의 영상 사이트

유튜브처럼 영상을 올리고 볼 수 있는 사이트예요.

- **누구나** 영상을 보고 검색하고 카테고리별로 볼 수 있어요.
- 영상을 **올리고 지우는 건 주인(나)만** 할 수 있어요. 주소는 `사이트주소/studio.html`이에요.
- 영상 파일과 정보는 **Supabase**(무료 클라우드 저장소)에 저장돼요.

## 파일 구성

| 파일 | 하는 일 |
|---|---|
| `index.html` | 홈: 영상 목록, 검색, 카테고리 |
| `watch.html` | 영상 재생 화면, 조회수, 다음 영상 |
| `studio.html` | 스튜디오: 로그인, 영상 올리기, 내 영상 삭제 |
| `config.js` | **설정 파일**: Supabase 주소·키, 사이트 이름, 카테고리 |
| `app.js`, `styles.css` | 공통 기능과 디자인 |
| `supabase-setup.sql` | Supabase에 한 번 붙여넣고 실행하는 설정 |

---

## Supabase 연결하기 (처음 한 번만, 15분 정도)

### 1. Supabase 가입하고 프로젝트 만들기
1. https://supabase.com 에 들어가서 **Start your project**를 누르고 GitHub 계정으로 로그인해요.
2. **New project**를 눌러요.
   - Name: `cogutv` (아무거나)
   - Database Password: 아무 비밀번호나 정하고 따로 적어두기
   - Region: **Northeast Asia (Seoul)**
3. **Create new project**를 누르고 1~2분 기다려요.

### 2. 설정 SQL 실행하기
1. 왼쪽 메뉴에서 **SQL Editor**를 눌러요.
2. 이 저장소의 `supabase-setup.sql` 내용을 **전부 복사**해서 붙여넣어요.
3. 오른쪽 아래 **Run**을 눌러요. `Success`가 나오면 끝이에요.

### 3. 내 로그인 계정 만들기
1. 왼쪽 메뉴에서 **Authentication → Users**로 가요.
2. **Add user → Create new user**를 눌러요.
3. 이메일과 비밀번호를 넣고, **Auto Confirm User**를 체크한 다음 만들어요.
   → 이 이메일/비밀번호로 스튜디오에 로그인하게 돼요.

### 4. ⚠️ 다른 사람 가입 막기 (중요)
1. **Authentication**의 설정 화면(Sign In / Providers)으로 가요.
2. **Allow new users to sign up**을 **끄고** 저장해요.
   → 이걸 꺼야 나 말고 아무도 계정을 만들어서 영상을 올릴 수 없어요.

### 5. 사이트에 Supabase 주소와 키 넣기
1. 왼쪽 아래 **Project Settings → API**(또는 **API Keys**)로 가요.
2. 두 가지를 복사해요.
   - **Project URL**: `https://xxxx.supabase.co`
   - **anon public** 키: `eyJ...`로 시작하는 긴 글자
3. GitHub에서 `config.js`를 열고 연필(✏️) 아이콘을 눌러 아래처럼 붙여넣은 다음 **Commit changes**를 눌러요.
   ```js
   export const SUPABASE_URL = "https://xxxx.supabase.co";
   export const SUPABASE_ANON_KEY = "eyJ...";
   ```
   > anon 키는 사이트에 공개돼도 괜찮은 키예요. 보안은 2번 SQL 규칙이 지켜줘요.
   > 단, **service_role** 키는 절대 넣지 마세요.

   (또는 Claude한테 "config.js에 이 URL이랑 키 넣어줘"라고 말해도 돼요.)

### 6. 확인하기
Vercel이 1분 안에 자동으로 다시 배포해요.
1. `사이트주소/studio.html`에 들어가서 3번에서 만든 계정으로 로그인해요.
2. 영상을 올려요.
3. 홈 화면에 영상이 보이면 성공이에요 🎉

---

## 알아둘 점

- **무료 요금제 한도**: 파일당 50MB, 전체 저장공간 약 1GB, 월 전송량도 정해져 있어요. 영상이 많아지면 Supabase 유료(Pro)로 올리거나, 영상을 압축해서(예: 720p) 올리세요.
  - 유료로 바꿔 파일당 한도를 늘렸다면 `config.js`의 `MAX_UPLOAD_MB`도 같이 올려주세요.
- **MP4(H.264)** 형식이 거의 모든 브라우저와 휴대폰에서 재생돼요. 아이폰으로 찍은 MOV/HEVC 영상은 일부 브라우저에서 안 나올 수 있어요.
- **올리면 안 되는 영상**: 남의 영상·영화·드라마·음원 등 저작권이 있는 영상, 성인물은 Supabase/Vercel 약관과 법 위반이라 계정이 정지될 수 있어요.
- **카테고리 바꾸기**: `config.js`의 `CATEGORIES` 목록을 고치면 돼요.
- **사이트 이름 바꾸기**: `config.js`의 `SITE_NAME`을 고치면 돼요.
