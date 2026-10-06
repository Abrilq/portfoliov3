create extension if not exists pgcrypto;

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false);
$$;

create table if not exists public.profile (
  id smallint primary key default 1 check (id = 1),
  name text not null,
  role text not null,
  location text not null,
  email text not null,
  phone text not null default '',
  website text not null default '',
  summary text not null default '',
  availability text not null default '',
  education_school text not null default '',
  education_degree text not null default '',
  education_start text not null default '',
  education_end text not null default '',
  skills text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  title text not null,
  location text not null default '',
  start_date date not null,
  end_date date,
  highlights text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint experiences_unique_role_start unique (company, title, start_date)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  role text not null,
  year text not null,
  category text not null default '',
  summary text not null,
  body_html text not null default '',
  stack text[] not null default '{}',
  live_url text not null default '',
  repo_url text not null default '',
  featured boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint certifications_unique_credential unique (title, issuer, year)
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  year text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profile enable row level security;
alter table public.experiences enable row level security;
alter table public.projects enable row level security;
alter table public.certifications enable row level security;

drop policy if exists "Public can read profile" on public.profile;
create policy "Public can read profile" on public.profile for select using (true);
drop policy if exists "Admins can manage profile" on public.profile;
create policy "Admins can manage profile" on public.profile for all using (public.is_site_admin()) with check (public.is_site_admin());

drop policy if exists "Public can read published experiences" on public.experiences;
create policy "Public can read published experiences" on public.experiences for select using (published);
drop policy if exists "Admins can manage experiences" on public.experiences;
create policy "Admins can manage experiences" on public.experiences for all using (public.is_site_admin()) with check (public.is_site_admin());

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects" on public.projects for select using (published);
drop policy if exists "Admins can manage projects" on public.projects;
create policy "Admins can manage projects" on public.projects for all using (public.is_site_admin()) with check (public.is_site_admin());

drop policy if exists "Public can read published certifications" on public.certifications;
create policy "Public can read published certifications" on public.certifications for select using (published);
drop policy if exists "Admins can manage certifications" on public.certifications;
create policy "Admins can manage certifications" on public.certifications for all using (public.is_site_admin()) with check (public.is_site_admin());

revoke all on table public.profile, public.experiences, public.projects, public.certifications from anon, authenticated;
grant select on public.profile, public.experiences, public.projects, public.certifications to anon, authenticated;
grant insert, update, delete on public.profile, public.experiences, public.projects, public.certifications to authenticated;

insert into public.profile (id, name, role, location, email, phone, website, summary, availability, education_school, education_degree, education_start, education_end, skills)
values (
  1,
  'John Clarence A. Legaspi',
  'Frontend developer & IT graduate',
  'Bocaue, Bulacan, Philippines',
  'clarence.legaspi.dev@gmail.com',
  '+63 961 261 4463',
  'https://clarence-port.vercel.app',
  'Information Technology graduate with hands-on experience in web development, frontend engineering, and enterprise system enhancement. I build responsive web experiences and improve the workflows behind them.',
  'Open to frontend and web development opportunities',
  'Dr. Yanga''s Colleges Inc.',
  'Bachelor of Science in Information Technology',
  '2021',
  '2025',
  array['HTML', 'CSS', 'JavaScript', 'TypeScript', 'C#', 'PHP', 'MySQL', 'React', 'Vite', 'Klaviyo', 'Replo', 'Shopify', 'Flutter', 'Unity', 'Blender', 'Figma', 'Git']
)
on conflict (id) do nothing;

insert into public.experiences (company, title, location, start_date, end_date, highlights, sort_order)
values
  ('Shopify E-commerce Client', 'Freelance Web Developer', 'Remote', '2025-11-01', '2026-02-28', array['Developed responsive Klaviyo email templates for e-commerce campaigns', 'Implemented dynamic email content with Liquid variables', 'Built Shopify landing pages with Replo', 'Improved mobile usability and structured page layouts'], 1),
  ('St. Martin Cooperative', 'IT Intern (Programmer)', 'On-site', '2025-03-01', '2025-07-31', array['Enhanced the Service Request Form system with new features and usability improvements', 'Refined a hierarchical approval workflow', 'Collaborated with IT teammates to test updates, troubleshoot issues, and support internal users'], 2)
on conflict (company, title, start_date) do nothing;

insert into public.projects (slug, title, role, year, category, summary, body_html, stack, featured, sort_order)
values
  ('lost-and-found', 'Lost & Found WebApp', 'Team Leader, Full-Stack Developer', '2025', 'Service platform', 'A service-based web app for tracking found items through clear, role-based workflows.', '<p>Led a three-member team to plan and build a service-based web application. The experience organizes item tracking around clear roles and a predictable handoff from report to resolution.</p><h2>My contribution</h2><p>I shaped the system architecture, coordinated implementation, and built role-aware workflows that make each item easier to follow.</p>', array['Full-stack development', 'Role-based workflows', 'Team leadership'], true, 1),
  ('pre-advising', 'Pre-advising System', 'UI/UX Designer, Frontend Developer', '2025', 'Education', 'A focused subject-planning interface organized around course, year level, and semester.', '<p>Designed a web interface that helps students view and manage subjects by course, year, and semester. The information structure keeps academic planning easy to scan.</p><h2>Design focus</h2><p>Clear navigation, readable subject groupings, and a direct path from overview to individual semester details.</p>', array['UI/UX design', 'Frontend development', 'Education'], true, 2),
  ('eyewear-store', 'E-commerce Website', 'Project Leader, Frontend Developer', '2024', 'Commerce', 'An eyewear storefront with responsive product displays and product variant selection.', '<p>Led frontend development for an eyewear e-commerce website, building a responsive storefront that makes product options simple to compare.</p><h2>What I built</h2><p>Responsive product displays and variant selection features designed to stay clear across screen sizes.</p>', array['E-commerce', 'Responsive UI', 'Product variants'], true, 3),
  ('ar-learning', 'Augmented Reality Learning', '3D Designer, Full-Stack Developer', '2024', 'Interactive learning', 'An AR mobile experience using ARCore and C# to make learning interactive.', '<p>Developed an augmented reality mobile application with ARCore and C#. The project combines 3D assets with interactive features to support an engaging learning experience.</p>', array['ARCore', 'C#', '3D design'], true, 4),
  ('damath', 'DaMath Educational Game', '3D Designer', '2024', 'Game design', 'Interactive 3D chessboard and game assets modeled in Blender.', '<p>Modeled the interactive 3D chessboard and game assets for an educational DaMath game, translating familiar board-game elements into a digital learning environment.</p>', array['Blender', '3D modeling', 'Education'], false, 5)
on conflict (slug) do nothing;

insert into public.certifications (title, issuer, year, sort_order)
values
  ('Networking Basics', 'Cisco', '2024', 1),
  ('Fundamentals of Predictive Project Management', 'Project Management Institute', '2023', 2),
  ('Introduction to Cybersecurity', 'Cisco', '2023', 3),
  ('MS Office Excel Associate', 'Microsoft', '2023', 4)
on conflict (title, issuer, year) do nothing;