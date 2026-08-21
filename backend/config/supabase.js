const { createClient } = require("@supabase/supabase-js");
// console.log(process.env.SUPABASE_URL);

// console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
// console.log(
//   "SECRET KEY LOADED:",
//   !!process.env.SUPABASE_SECRET_KEY
// );
// console.log(
//   "SECRET KEY PREFIX:",
//   process.env.SUPABASE_SECRET_KEY?.substring(0, 11)
// );

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

module.exports = supabase;
