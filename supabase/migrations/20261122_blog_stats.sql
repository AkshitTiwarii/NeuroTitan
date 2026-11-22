-- Blog reactions, view counts and measured reading time for neurotitan.in.
-- Stores counters only: no IP addresses, no cookies, no user identifiers.
-- Tables are locked (RLS on, no policies); the browser can only call the four functions below.

create table if not exists public.blog_post_stats (
  slug          text primary key check (slug ~ '^[a-z0-9-]{1,100}$'),
  views         bigint not null default 0,
  read_seconds  bigint not null default 0,
  read_samples  bigint not null default 0,
  updated_at    timestamptz not null default now()
);

create table if not exists public.blog_reactions (
  slug   text not null check (slug ~ '^[a-z0-9-]{1,100}$'),
  kind   text not null check (kind in ('like', 'love', 'celebrate', 'support', 'insightful')),
  count  bigint not null default 0 check (count >= 0),
  primary key (slug, kind)
);

alter table public.blog_post_stats enable row level security;
alter table public.blog_reactions  enable row level security;
revoke all on public.blog_post_stats, public.blog_reactions from anon, authenticated;

-- One view (the browser sends at most one per post per day).
create or replace function public.blog_view(p_slug text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_slug !~ '^[a-z0-9-]{1,100}$' then return; end if;
  insert into public.blog_post_stats (slug, views) values (p_slug, 1)
  on conflict (slug) do update set views = public.blog_post_stats.views + 1, updated_at = now();
end $$;

-- Reading time, sent in slices while the tab is visible and the reader is active.
-- p_first = true starts a new reading session (counted once in read_samples).
create or replace function public.blog_read(p_slug text, p_seconds int, p_first boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_slug !~ '^[a-z0-9-]{1,100}$' or p_seconds < 1 or p_seconds > 60 then return; end if;
  insert into public.blog_post_stats (slug, read_seconds, read_samples)
  values (p_slug, p_seconds, case when p_first then 1 else 0 end)
  on conflict (slug) do update set
    read_seconds = public.blog_post_stats.read_seconds + p_seconds,
    read_samples = public.blog_post_stats.read_samples + case when p_first then 1 else 0 end,
    updated_at = now();
end $$;

-- Add (+1) or remove (-1) one reaction.
create or replace function public.blog_react(p_slug text, p_kind text, p_delta int)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_slug !~ '^[a-z0-9-]{1,100}$' or p_delta not in (-1, 1)
     or p_kind not in ('like', 'love', 'celebrate', 'support', 'insightful') then return; end if;
  insert into public.blog_reactions (slug, kind, count) values (p_slug, p_kind, greatest(p_delta, 0))
  on conflict (slug, kind) do update set count = greatest(public.blog_reactions.count + p_delta, 0);
end $$;

-- Public counts for a list of posts.
create or replace function public.blog_stats(p_slugs text[])
returns table (slug text, views bigint, read_seconds bigint, read_samples bigint, reactions jsonb)
language sql stable security definer set search_path = '' as $$
  select s.slug,
         coalesce(p.views, 0), coalesce(p.read_seconds, 0), coalesce(p.read_samples, 0),
         coalesce((select jsonb_object_agg(r.kind, r.count) from public.blog_reactions r where r.slug = s.slug), '{}'::jsonb)
  from unnest(p_slugs[1:50]) as s(slug)
  left join public.blog_post_stats p on p.slug = s.slug;
$$;

revoke all on function public.blog_view(text), public.blog_read(text, int, boolean),
  public.blog_react(text, text, int), public.blog_stats(text[]) from public;
grant execute on function public.blog_view(text), public.blog_read(text, int, boolean),
  public.blog_react(text, text, int), public.blog_stats(text[]) to anon, authenticated;
