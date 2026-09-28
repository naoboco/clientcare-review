begin;

insert into users (id, name, email, password_hash)
overriding system value
values (
  1,
  'Demo Coordinator',
  'coordinator@clientcare.demo',
  '$2b$12$YOtsO0TKMErOYWE3V2oMeujZaRQWFQr6KyVujc40h2s/0.EVQZHRm'
)
on conflict (id) do update
set
  name = excluded.name,
  email = excluded.email,
  password_hash = excluded.password_hash;

select setval(
  pg_get_serial_sequence('users', 'id'),
  greatest((select max(id) from users), 1),
  true
);

commit;
