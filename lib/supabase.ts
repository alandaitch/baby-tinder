import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wnfqepwickqdhxehyplg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZnFlcHdpY2txZGh4ZWh5cGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTUxMDAsImV4cCI6MjA1ODQzMTEwMH0.9_vwbTqP8z7AMrxfCHxNhozf7-MA_obqj_FZ3TNv09M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 