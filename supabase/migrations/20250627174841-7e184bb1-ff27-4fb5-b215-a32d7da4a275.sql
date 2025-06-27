
-- Add foreign key relationship between comments and profiles tables
ALTER TABLE public.comments 
ADD CONSTRAINT fk_comments_profiles 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
