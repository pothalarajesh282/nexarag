import os

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

# print("SUPABASE URL:", SUPABASE_URL)
# print("KEY LOADED:", bool(SUPABASE_SECRET_KEY))
# print("KEY PREFIX:", SUPABASE_SECRET_KEY[:10] if SUPABASE_SECRET_KEY else None)

if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is missing")

if not SUPABASE_SECRET_KEY:
    raise ValueError("SUPABASE_SECRET_KEY is missing")

supabase = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)
# try:
#     test = supabase.table("documents").select("*").limit(1).execute()
#     print("DIRECT SUPABASE TEST:", test.data)
# except Exception as e:
#     print("DIRECT SUPABASE TEST ERROR:", repr(e))
