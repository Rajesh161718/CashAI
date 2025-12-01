import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ REPLACE THESE WITH YOUR ACTUAL SUPABASE KEYS
const SUPABASE_URL = 'https://irjbjqvleuedffdfibmt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyamJqcXZsZXVlZGZmZGZpYm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4Njg5ODUsImV4cCI6MjA3OTQ0NDk4NX0.Uzpvg9BMXPTOKnL9UY6KmKBec5a8c8xMZ_9YevBmwFI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
