create table users (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_name_not_blank check (char_length(btrim(name)) >= 2),
  constraint users_email_lowercase check (email = lower(email)),
  constraint users_email_shape check (position('@' in email) > 1)
);

create table clients (
  id bigint generated always as identity primary key,
  owner_id bigint not null references users(id) on delete restrict,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  summary text,
  identified_needs text[] not null default '{}'::text[],
  missing_information text[] not null default '{}'::text[],
  suggested_next_action text,
  last_contact_date date,
  next_follow_up_date date,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clients_first_name_not_blank check (char_length(btrim(first_name)) > 0),
  constraint clients_last_name_not_blank check (char_length(btrim(last_name)) > 0),
  constraint clients_email_lowercase check (email = lower(email)),
  constraint clients_email_shape check (position('@' in email) > 1)
);

create table ai_analyses (
  id bigint generated always as identity primary key,
  client_id bigint not null references clients(id) on delete cascade,
  reviewed_by bigint not null references users(id) on delete restrict,
  model_name text not null,
  summary text not null,
  identified_needs text[] not null default '{}'::text[],
  missing_information text[] not null default '{}'::text[],
  suggested_next_action text not null,
  confirmed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint ai_analyses_model_name_not_blank check (char_length(btrim(model_name)) > 0),
  constraint ai_analyses_summary_not_blank check (char_length(btrim(summary)) > 0),
  constraint ai_analyses_next_action_not_blank check (char_length(btrim(suggested_next_action)) > 0)
);

create index clients_owner_id_idx on clients (owner_id);

create index clients_active_email_idx on clients (owner_id, email)
where archived_at is null;

create index clients_active_follow_up_idx on clients (owner_id, next_follow_up_date)
where archived_at is null and next_follow_up_date is not null;

create index clients_active_name_idx on clients (owner_id, lower(last_name), lower(first_name))
where archived_at is null;

create index ai_analyses_client_created_at_idx on ai_analyses (client_id, created_at desc);

create index ai_analyses_reviewed_by_idx on ai_analyses (reviewed_by);

create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
before update on users
for each row
execute function set_updated_at();

create trigger clients_set_updated_at
before update on clients
for each row
execute function set_updated_at();

