// 모든 페이지가 같이 쓰는 기능 모음
import { SUPABASE_URL, SUPABASE_ANON_KEY, SITE_NAME, CATEGORIES, MAX_UPLOAD_MB } from "./config.js";

export { SUPABASE_URL, SUPABASE_ANON_KEY, SITE_NAME, CATEGORIES, MAX_UPLOAD_MB };
export const BUCKET = "videos";
export const CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let _sb = null;
export async function sb() {
  if (!CONFIGURED) return null;
  if (_sb) return _sb;
  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  _sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _sb;
}

export function publicUrl(path) {
  if (!path) return "";
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function fmtViews(n) {
  n = Number(n) || 0;
  if (n >= 1e8) return `조회수 ${trim(n / 1e8)}억회`;
  if (n >= 1e4) return `조회수 ${trim(n / 1e4)}만회`;
  if (n >= 1e3) return `조회수 ${trim(n / 1e3)}천회`;
  return `조회수 ${n}회`;
}
const trim = (x) => (x >= 10 ? Math.floor(x) : Math.floor(x * 10) / 10).toString();

export function timeAgo(iso) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const units = [[31536000, "년"], [2592000, "개월"], [604800, "주"], [86400, "일"], [3600, "시간"], [60, "분"]];
  for (const [sec, label] of units) if (s >= sec) return `${Math.floor(s / sec)}${label} 전`;
  return "방금 전";
}

export function fmtDur(sec) {
  sec = Math.round(Number(sec) || 0);
  if (!sec) return "";
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  const p = (x) => String(x).padStart(2, "0");
  return h ? `${h}:${p(m)}:${p(s)}` : `${m}:${p(s)}`;
}

const initial = () => SITE_NAME.trim().charAt(0).toUpperCase() || "V";

// ---------- 상단바 ----------
export function renderTopbar({ query = "" } = {}) {
  document.title = document.title.replace("{SITE}", SITE_NAME);
  const el = document.getElementById("topbar");
  el.innerHTML = `
    <a class="logo" href="./" aria-label="${esc(SITE_NAME)} 홈"><span class="logo-mark"></span><span class="name">${esc(SITE_NAME)}</span></a>
    <form class="search" action="./" method="get" role="search">
      <input name="q" type="search" placeholder="검색" value="${esc(query)}" aria-label="영상 검색">
      <button type="submit" aria-label="검색">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
      </button>
    </form>
    <div class="top-actions">
      <a class="btn" href="studio.html" title="영상 올리기">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3"/><path d="M9 9v6M6 12h6"/></svg>
        <span class="lbl">만들기</span>
      </a>
    </div>`;
}

export function renderNotice(where) {
  if (CONFIGURED) return;
  const n = document.createElement("div");
  n.className = "notice";
  n.innerHTML = `<b>아직 Supabase가 연결되지 않았어요.</b> 지금 보이는 영상은 화면 예시예요. <code>config.js</code>에 Supabase 주소와 키를 넣으면 실제로 영상을 올리고 볼 수 있어요. (설정 방법: 저장소의 <b>README.md</b>)`;
  where.before(n);
}

// ---------- 영상 카드 ----------
export function cardHTML(v, { mini = false } = {}) {
  const href = `watch.html?v=${encodeURIComponent(v.id)}`;
  const thumb = v.demo
    ? `<div class="demo-thumb" style="background:${v.bg}">${v.emoji}</div>`
    : v.thumb_path ? `<img src="${esc(publicUrl(v.thumb_path))}" alt="" loading="lazy">` : "";
  const dur = fmtDur(v.duration);
  const meta = `${fmtViews(v.views)} · ${timeAgo(v.created_at)}`;
  if (mini) {
    return `<a class="mini card" href="${href}">
      <div class="thumb">${thumb}${dur ? `<span class="dur">${dur}</span>` : ""}</div>
      <div><h3 class="card-title">${esc(v.title)}</h3><div class="meta">${esc(SITE_NAME)}</div><div class="meta">${meta}</div></div>
    </a>`;
  }
  return `<a class="card" href="${href}">
    <div class="thumb">${thumb}${dur ? `<span class="dur">${dur}</span>` : ""}</div>
    <div class="card-body">
      <div class="avatar">${esc(initial())}</div>
      <div><h3 class="card-title">${esc(v.title)}</h3>
        <div class="meta">${esc(SITE_NAME)}${v.category ? `<span class="tag">${esc(v.category)}</span>` : ""}</div>
        <div class="meta">${meta}</div></div>
    </div>
  </a>`;
}

export function skeletonHTML(n = 8) {
  return Array.from({ length: n }, () => `<div class="card skeleton"><div class="thumb"></div><div class="card-body"><div class="avatar" style="background:var(--sunk)"></div><div style="flex:1"><div class="s-line"></div><div class="s-line" style="width:60%"></div></div></div></div>`).join("");
}

// ---------- 예시 데이터 (Supabase 연결 전에만 보임) ----------
const day = 86400000;
export const DEMO = [
  ["코인 차트 보는 법 10분 정리", "코인", "📈", "#1d3b2a", 612, 15400, 2],
  ["퇴근 후 기타 연습 한 달 기록", "음악", "🎸", "#3b2a1d", 384, 2300, 5],
  ["등 운동 루틴 — 덤벨·바벨", "운동", "🏋️", "#1d2a3b", 925, 48100, 9],
  ["부산 광안리 밤 산책 브이로그", "여행", "🌊", "#16324a", 1260, 7800, 14],
  ["5분 만에 만드는 자취 요리", "요리", "🍳", "#3b351d", 301, 120400, 21],
  ["일본어 기초 회화 20문장", "교육", "🗾", "#3b1d2a", 1480, 3100, 30],
  ["오늘의 게임 하이라이트", "게임", "🎮", "#2a1d3b", 543, 960, 40],
  ["새 집 구하러 다닌 하루", "일상", "🏠", "#24331d", 712, 18200, 60],
].map(([title, category, emoji, bg, duration, views, ago], i) => ({
  id: `demo-${i}`, demo: true, title, category, emoji, bg, duration, views,
  created_at: new Date(Date.now() - ago * day).toISOString(),
  description: "이건 예시 영상이에요. Supabase를 연결하고 스튜디오에서 영상을 올리면 이 자리에 실제 영상이 나와요.",
}));
