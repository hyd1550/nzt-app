import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://brusxotzrmfmfmysztku.supabase.co'
const supabaseKey = 'sb_publishable_WTXM-DQvM0H_ywajxURRDA_lkP3a1Hj'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})
