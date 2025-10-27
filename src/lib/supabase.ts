import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ybdyctxnbwyaogdpardx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliZHljdHhuYnd5YW9nZHBhcmR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MDUxMDQsImV4cCI6MjA3NzA4MTEwNH0.8AhCSnB0BjeJRdMS79MSrfVO4lsaW5s3CiHWr_hRuOw';
export const supabase = createClient(supabaseUrl, supabaseKey);