const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
    // CORS hlavičky (potrebné pre lokálny vývoj)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // GET /api/scores → vráti top 10 skóre
    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('scores')
            .select('name, score, character')
            .order('score', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Supabase GET error:', error);
            return res.status(500).json({ error: 'Databáza nedostupná' });
        }
        return res.status(200).json(data);
    }

    // POST /api/scores → uloží nové skóre
    if (req.method === 'POST') {
        const { name, score, character } = req.body || {};

        // Validácia vstupu
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ error: 'Chýba meno hráča' });
        }
        if (!score || typeof score !== 'number' || score <= 0 || !Number.isInteger(score)) {
            return res.status(400).json({ error: 'Neplatné skóre' });
        }
        const validChars = ['zajko', 'macka', 'liska'];
        const safeChar = validChars.includes(character) ? character : 'zajko';
        const safeName = name.trim().slice(0, 12);

        // Zistenie aktuálneho rekordu (pred vložením)
        const { data: top } = await supabase
            .from('scores')
            .select('score')
            .order('score', { ascending: false })
            .limit(1);

        const prevBest = top?.[0]?.score || 0;
        const isRecord = score > prevBest;

        // Vloženie nového skóre
        const { data, error } = await supabase
            .from('scores')
            .insert({ name: safeName, score, character: safeChar })
            .select()
            .single();

        if (error) {
            console.error('Supabase POST error:', error);
            return res.status(500).json({ error: 'Nemožno uložiť skóre' });
        }
        return res.status(201).json({ ...data, isRecord });
    }

    return res.status(405).json({ error: 'Metóda nie je povolená' });
};
