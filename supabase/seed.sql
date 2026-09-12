insert into categories (slug, name, accent, sort_order) values
  ('photography',    'Photography',    'pink',   1),
  ('web-tech',       'Web & Tech',     'blue',   2),
  ('catering',       'Catering',       'yellow', 3),
  ('tailoring',      'Tailoring',      'green',  4),
  ('tutoring',       'Tutoring',       'blue',   5),
  ('electrical',     'Electrical',     'yellow', 6),
  ('events-decor',   'Events & Décor', 'purple', 7),
  ('beauty',         'Beauty',         'pink',   8),
  ('plumbing',       'Plumbing',       'blue',   9),
  ('design',         'Design',         'purple', 10),
  ('music-dj',       'Music & DJ',     'green',  11),
  ('transport',      'Transport',      'yellow', 12)
on conflict (slug) do nothing;
