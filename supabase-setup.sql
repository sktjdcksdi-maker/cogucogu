-- ============================================================
--  Supabase 설정 — 이 파일 내용을 통째로 복사해서
--  Supabase 대시보드 → SQL Editor 에 붙여넣고 Run 을 누르세요.
--  (한 번만 실행하면 됩니다)
-- ============================================================

-- 1) 영상 정보 표
create table if not exists public.videos (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  title       text not null,
  description text not null default '',
  category    text not null default '기타',
  video_path  text not null,
  thumb_path  text,
  duration    real,
  views       bigint not null default 0,
  owner       uuid not null default auth.uid() references auth.users on delete cascade
);
create index if not exists videos_created_idx on public.videos (created_at desc);

-- 2) 보안 규칙: 누구나 보기만, 올리기·수정·삭제는 로그인한 주인만
alter table public.videos enable row level security;

drop policy if exists "videos_read"   on public.videos;
drop policy if exists "videos_insert" on public.videos;
drop policy if exists "videos_update" on public.videos;
drop policy if exists "videos_delete" on public.videos;

create policy "videos_read"   on public.videos for select using (true);
create policy "videos_insert" on public.videos for insert to authenticated with check (owner = auth.uid());
create policy "videos_update" on public.videos for update to authenticated using (owner = auth.uid());
create policy "videos_delete" on public.videos for delete to authenticated using (owner = auth.uid());

-- 3) 조회수 +1 (방문자도 쓸 수 있게, 조회수만 올리도록 제한)
create or replace function public.add_view(vid uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.videos set views = views + 1 where id = vid;
$$;
grant execute on function public.add_view(uuid) to anon, authenticated;

-- 4) 영상 파일 저장소(버킷) 만들기 — 누구나 재생 가능(public)
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do update set public = true;

-- 5) 저장소 보안 규칙: 로그인한 사람만 파일 올리기·지우기
drop policy if exists "videos_bucket_select" on storage.objects;
drop policy if exists "videos_bucket_insert" on storage.objects;
drop policy if exists "videos_bucket_update" on storage.objects;
drop policy if exists "videos_bucket_delete" on storage.objects;

create policy "videos_bucket_select" on storage.objects
  for select to authenticated using (bucket_id = 'videos');
create policy "videos_bucket_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'videos');
create policy "videos_bucket_update" on storage.objects
  for update to authenticated using (bucket_id = 'videos');
create policy "videos_bucket_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'videos');
