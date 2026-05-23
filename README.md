# 🌲 Lesný Runner

HTML5 runner hra s rebríčkom uloženým v Supabase databáze, nasadená na Vercel.

---

## 🚀 Nasadenie – krok za krokom

### Krok 1 – Supabase databáza

1. Choď na [supabase.com](https://supabase.com) a vytvor si účet (zadarmo)
2. Klikni **New Project** → zadaj meno projektu a heslo
3. Po vytvorení choď do **SQL Editor** a spusti tento SQL:

```sql
-- Vytvor tabuľku skóre
CREATE TABLE public.scores (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL CHECK (char_length(name) <= 12),
  score      INTEGER NOT NULL CHECK (score > 0),
  character  TEXT NOT NULL DEFAULT 'zajko'
               CHECK (character IN ('zajko', 'macka', 'liska')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Zapni Row Level Security
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Povol verejné čítanie rebríčka
CREATE POLICY "Verejné čítanie" ON public.scores
  FOR SELECT USING (true);
```

4. Choď do **Settings → API** a skopíruj:
   - `Project URL` → toto je tvoje `SUPABASE_URL`
   - `service_role` secret key → toto je `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ `service_role` kľúč je tajný – nikdy ho nedávaj do frontendu ani na GitHub!

---

### Krok 2 – GitHub repozitár

```bash
# V priečinku HRA LILY:
git init
git add .
git commit -m "Initial commit – Lesný Runner"

# Vytvor nový repozitár na github.com, potom:
git remote add origin https://github.com/TVOJE_MENO/lesny-runner.git
git push -u origin main
```

---

### Krok 3 – Vercel nasadenie

1. Choď na [vercel.com](https://vercel.com) → **Add New Project**
2. Importuj GitHub repozitár `lesny-runner`
3. Framework preset: **Other**
4. Klikni **Environment Variables** a pridaj:

| Kľúč | Hodnota |
|------|---------|
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` |

5. Klikni **Deploy** ✅

---

### Krok 4 – Lokálny vývoj (voliteľné)

```bash
npm install
cp .env.example .env
# Vyplň .env svojimi Supabase hodnotami

npm install -g vercel
vercel dev
# Hra beží na http://localhost:3000
```

---

## 📁 Štruktúra projektu

```
HRA LILY/
├── index.html          ← hra (frontend)
├── api/
│   └── scores.js       ← Vercel serverless funkcia
├── package.json
├── vercel.json
├── .gitignore
├── .env.example        ← šablóna (bez tajných hodnôt)
└── README.md
```

## 🎮 API Endpointy

| Method | URL | Popis |
|--------|-----|-------|
| `GET` | `/api/scores` | Vráti top 10 skóre |
| `POST` | `/api/scores` | Uloží nové skóre |
