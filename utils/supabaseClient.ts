import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://myoxmizxxcauqccmqfye.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15b3htaXp4eGNhdXFjY21xZnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MzQxNjUsImV4cCI6MjA1ODQxMDE2NX0.QMKdlwd7V-LZFw6rzzcz9fa9VAMJmOKFYrc54SDeNxc'; // <- Ve a Supabase > Project Settings > API > Public anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
