// ============================================================
//  사이트 설정 파일 — 여기만 바꾸면 됩니다
// ============================================================

// 1) Supabase 연결 정보
//    Supabase 대시보드 → Project Settings → API 에서 복사해 붙여넣으세요.
//    비워두면 "예시 화면"으로 보입니다.
export const SUPABASE_URL = "https://mpnmasrtahujfrvipife.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_mvHaCp9ef0JC_JbHAp4m0A_uH57TpG2"; // Publishable 키 (공개돼도 괜찮은 키)

// 2) 사이트 이름 (로고와 브라우저 탭에 표시)
export const SITE_NAME = "COGU TV";

// 3) 영상 한 개당 최대 용량(MB)
//    Supabase 무료 요금제는 파일당 50MB까지 올릴 수 있어요.
export const MAX_UPLOAD_MB = 50;

// 4) 카테고리 목록 (마음대로 추가·삭제 가능)
export const CATEGORIES = [
  "게임", "음악", "코인", "일상", "운동", "교육", "요리", "여행", "엔터", "기타",
];
