-- 在 Supabase SQL 编辑器中运行此脚本

-- 创建交易帖子表
create table if not exists trade_posts (
  id bigint generated always as identity primary key,
  type text not null check (type in ('sell', 'buy')),
  crop text not null,
  quantity numeric not null,
  price numeric not null,
  location text not null,
  quality text,
  phone text not null,
  user_name text,
  user_id uuid references auth.users(id),
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '30 days')
);

-- 开启行级安全
alter table trade_posts enable row level security;

-- 所有人可以读取
create policy "任何人可读" on trade_posts for select using (true);

-- 登录用户可以发布
create policy "登录用户可发布" on trade_posts for insert with check (auth.uid() is not null);

-- 只有自己可以删除
create policy "只能删除自己的" on trade_posts for delete using (auth.uid() = user_id);
