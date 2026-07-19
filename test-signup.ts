import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cqtdcursoqetbxzsecby.supabase.co'
const supabaseKey = 'sb_publishable_Zz5eNXOZ3YmUdXKiKiqGhQ_S1QTnvnt'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSignup() {
  const { data, error } = await supabase.auth.signUp({
    email: `jean.dupont.${Date.now()}@gmail.com`,
    password: 'password123',
    options: {
      data: {
        role: 'lyceen_etudiant',
        prenom: 'Test',
        pays: 'Togo'
      }
    }
  })

  if (error) {
    console.error("Signup failed:", JSON.stringify(error, null, 2))
  } else {
    console.log("Signup successful!")
    console.log("User:", data.user?.id)
  }
}

testSignup()
