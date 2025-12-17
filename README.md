Anniversary site for Lanides & Mercy

How to preview locally:

- Run:
  python3 -m http.server 8000
- Open http://localhost:8000/ on your mobile device or desktop.

Notes:
- Pages are split for mobile navigation: `index.html` (home), `story.html`, `girls.html`, `timeline.html`, `gallery.html`, `messages.html`, `login.html`.
- Replace the files in `assets/images/` with your real photos (JPGs already added) and keep the same filenames listed in the `gallery.html` and `girls.html` files.
- The default client-side family password is `Uri-Khon`. To change it, open the browser console and run:
  localStorage.setItem('familyPassword','yourSecret');
- Owner-specific unlock passwords are set for messages:
  - Lanides (husband): `Eks_Lani`
  - Mercy (wife): `Mevrou_Uri-khos`
- This is a static, client-side site. Passwords and messages are stored locally in the browser (not secure against determined inspection); for stronger privacy I can help add server-side auth later.

Files added/updated:
- `index.html` — home (hero + countdown)
- `story.html` — your message and the poem
- `girls.html` — daughters & family photos
- `timeline.html` — placeholder timeline (please provide exact dates)
- `gallery.html` — password-protected gallery (now includes captions and a 10-image "Moments in Between" selection)
- Optimized images were generated and placed under `assets/images/gallery` (800px), `assets/images/large` (1600px), and `assets/images/thumbs` (400px); `gallery.html` automatically uses the `assets/images/gallery/*-800.jpg` images.
- The guestbook feature was removed per request.
- `messages.html` — two private messages (Lanides → Mercy, Mercy → Lanides)
- `login.html` — family login page
- `style.css` — refined, mobile-first khaki & maroon theme
- `scripts/main.js` — guarded, page-aware client logic

Next steps I can do on request:
- Replace placeholders with higher-quality thumbnails and add a simple on-disk optimization step (bash script + ImageMagick)
- Add an admin UI for password changes or a simple server (Node/Express) for proper authentication
- Improve gallery layout or add a slideshow

If you'd like me to swap the placeholders with different filenames or add captions to photos, tell me which files to change and the captions to use.
