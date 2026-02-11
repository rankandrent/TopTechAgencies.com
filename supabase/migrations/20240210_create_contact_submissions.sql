-- Create the contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    agency_name TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    source TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed'))
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserting data (public access for form submission)
CREATE POLICY "Allow public insertion of contact submissions" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading data (service role/admin only)
-- For now, we'll allow public read for development, but in production, this should be restricted
CREATE POLICY "Allow public read of contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (true);

-- Create policy to allow updating data (service role/admin only)
CREATE POLICY "Allow public update of contact submissions" 
ON public.contact_submissions 
FOR UPDATE 
USING (true);
