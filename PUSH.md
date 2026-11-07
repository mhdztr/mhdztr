# Push this as the profile README

1. On GitHub: **New repository** → name **`mhdztr`** (must equal the username) → **Public** → do NOT tick "Add a README" → Create.
2. In this folder:

   git add README.md PUSH.md assets
   git commit -m "profile readme"
   git remote add origin git@github.com:mhdztr/mhdztr.git
   git push -u origin main

   (HTTPS instead of SSH: remote = https://github.com/mhdztr/mhdztr.git)

   The first push prompts for GitHub auth: SSH needs a key registered on the account;
   with the HTTPS remote, the password is a personal access token, not your account password.

   Note: this folder already contains that initial commit, made locally and never pushed. If `git commit` reports "nothing to commit", that is expected — continue from `git remote add`.
3. Open https://github.com/mhdztr and check both themes (Settings → Appearance → Light, then Dark).
4. Optional, Settings → Public profile:
   - Name: `Zakki Thoriq`
   - Bio: `Rust, Java, JavaScript. Small tools and unglamorous government systems.`
