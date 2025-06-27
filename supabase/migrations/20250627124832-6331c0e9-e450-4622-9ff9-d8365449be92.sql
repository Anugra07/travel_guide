
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trips table for storing user searches
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  search_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  transport_options JSONB,
  homestays JSONB,
  eateries JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table for location reviews
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  location TEXT NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create treks table for trek information
CREATE TABLE public.treks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  difficulty_level TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  best_season TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for trips
CREATE POLICY "Users can view their own trips" ON public.trips
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own trips" ON public.trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trips" ON public.trips
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for comments (public read, authenticated write)
CREATE POLICY "Anyone can view comments" ON public.comments
  FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for treks (public read)
CREATE POLICY "Anyone can view treks" ON public.treks
  FOR SELECT TO public USING (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample trek data
INSERT INTO public.treks (name, location, difficulty_level, duration_days, best_season, description, image_url) VALUES
('Roopkund Trek', 'Uttarakhand', 'Difficult', 8, 'May-June, September-October', 'Famous for the mysterious skeleton lake at 16,500 feet altitude', '/lovable-uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
('Valley of Flowers Trek', 'Uttarakhand', 'Moderate', 6, 'July-September', 'UNESCO World Heritage site known for alpine flowers and wildlife', '/lovable-uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
('Hampta Pass Trek', 'Himachal Pradesh', 'Easy-Moderate', 5, 'June-September', 'Beautiful contrast between green valleys and barren landscapes', '/lovable-uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
('Kedarkantha Trek', 'Uttarakhand', 'Easy-Moderate', 4, 'December-April', 'Perfect winter trek with snow-covered peaks', '/lovable-uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
('Chadar Trek', 'Ladakh', 'Difficult', 9, 'January-February', 'Walking on frozen Zanskar river in extreme conditions', '/lovable-uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
('Goechala Trek', 'Sikkim', 'Difficult', 10, 'March-May, September-November', 'Stunning views of Kanchenjunga, the third highest peak', '/lovable-uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
('Sandakphu Trek', 'West Bengal', 'Moderate', 6, 'October-December, March-May', 'Highest peak in West Bengal with views of Everest', '/lovable-uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
('Pin Parvati Pass Trek', 'Himachal Pradesh', 'Very Difficult', 11, 'July-September', 'High altitude trek connecting Parvati and Spiti valleys', '/lovable-uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
('Markha Valley Trek', 'Ladakh', 'Moderate', 7, 'June-September', 'Classic Ladakh trek with Buddhist monasteries and wildlife', '/lovable-uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
('Stok Kangri Trek', 'Ladakh', 'Very Difficult', 9, 'July-September', 'Highest trekking peak in Stok range at 20,187 feet', '/lovable-uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png');
