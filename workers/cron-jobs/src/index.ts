import { createClient } from '@supabase/supabase-js'
import * as cheerio from 'cheerio'
import Parser from 'rss-parser'

export interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  OPENROUTER_API_KEY: string
  OPENROUTER_MODEL?: string
}

const parser = new Parser()

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    
    // Auth simple pour déclenchement manuel via curl
    if (url.searchParams.get('key') !== env.SUPABASE_SERVICE_KEY.substring(0, 10)) {
      return new Response('Unauthorized', { status: 401 })
    }

    if (url.pathname === '/veille') {
      await runVeilleIA(env)
      return new Response('Veille executed', { status: 200 })
    }

    if (url.pathname === '/recheck') {
      await runRecheckLiens(env)
      return new Response('Recheck executed', { status: 200 })
    }

    return new Response('Cron Service Active', { status: 200 })
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    if (event.cron === "0 8 * * *") {
      await runVeilleIA(env)
    } else if (event.cron === "0 9 * * *") {
      await runRecheckLiens(env)
    }
  }
}

async function runVeilleIA(env: Env) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)
  let sourcesProcessed = 0
  let oppsAdded = 0
  let details = []

  try {
    // 1. Get sources
    const { data: sources, error: sourcesErr } = await supabase
      .from('sources_veille')
      .select('*')

    if (sourcesErr) throw new Error("Erreur fetch sources: " + sourcesErr.message)

    for (const source of sources || []) {
      sourcesProcessed++
      try {
        // Fetch RSS manually (since https.get is not in CF Workers)
        const rssRes = await fetch(source.url)
        if (!rssRes.ok) throw new Error("Erreur fetch RSS: " + rssRes.statusText)
        const xml = await rssRes.text()
        const feed = await parser.parseString(xml)
        
        for (const item of feed.items.slice(0, 5)) { // Max 5 items par source par run pour limiter les couts
          if (!item.link) continue

          // Deduplication (lien exact)
          const { data: existingLink } = await supabase
            .from('opportunites')
            .select('id')
            .eq('lien_source', item.link)
            .single()

          if (existingLink) continue // Deja recupere

          // Fetch target page
          const pageRes = await fetch(item.link)
          if (!pageRes.ok) continue
          
          const html = await pageRes.text()
          const $ = cheerio.load(html)
          
          // Remove scripts and styles
          $('script, style, nav, footer, header').remove()
          const textContent = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 30000)

          // Call OpenRouter with Gemini Flash
          const modelName = env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001'

          const aiPrompt = `Tu es un expert en extraction d'opportunités (bourses, emplois, stages).
Extrais les informations de l'offre suivante au format JSON strict (sans markdown autour). 
Le JSON doit correspondre à cette structure :
{
  "titre": "string (obligatoire)",
  "description": "string (résumé détaillé, 2-3 paragraphes)",
  "type": "string (choix: bourse_etude, bourse_recherche, formation_courte, emploi, volontariat, financement, concours)",
  "montant_couverture": "string ou null",
  "pays_eligibles_residence": ["string"], 
  "pays_diffusion": ["string"],
  "niveau_requis": "string ou null",
  "deadline": "YYYY-MM-DD ou null",
  "tags": ["string"]
}
Ne renvoie QUE le JSON valide.

Contenu extrait depuis le site :
Titre : ${item.title}
Lien : ${item.link}

Contenu de la page:
${textContent}`

          const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: modelName,
              messages: [{ role: 'user', content: aiPrompt }]
            })
          })

          if (!aiRes.ok) {
            const errorText = await aiRes.text()
            throw new Error("API IA Error: " + aiRes.statusText + " - " + errorText)
          }
          
          const aiJsonRes = await aiRes.json() as any
          let rawContent = aiJsonRes.choices[0].message.content
          // Nettoyage si le modèle a ajouté des backticks markdown
          rawContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim()
          
          const extracted = JSON.parse(rawContent)

          // Deduplication avancée (titre similaire)
          // Dans une V2 on pourrait utiliser vector search, mais ici on check si un titre très proche existe.
          // On va ignorer cette etape pour le MVP pour garder le worker rapide, ou juste check le titre exact.
          const { data: existingTitle } = await supabase
            .from('opportunites')
            .select('id')
            .ilike('titre', extracted.titre)
            .single()

          if (existingTitle) {
            details.push(`Ignoré (titre existant): ${extracted.titre}`)
            continue
          }

          // Insert
          // Creer un slug simple
          const slug = extracted.titre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now()

          const { error: insertErr } = await supabase
            .from('opportunites')
            .insert({
              source_id: source.id,
              titre: extracted.titre,
              slug: slug,
              description: extracted.description,
              type: extracted.type || 'bourse_etude',
              montant_couverture: extracted.montant_couverture,
              pays_eligibles_residence: extracted.pays_eligibles_residence || [],
              pays_diffusion: extracted.pays_diffusion || [],
              niveau_requis: extracted.niveau_requis,
              deadline: extracted.deadline === 'null' ? null : extracted.deadline,
              lien_source: item.link,
              tags: extracted.tags || [],
              statut_fraicheur: 'a_jour',
              statut_moderation: 'detecte'
            })

          if (insertErr) {
            details.push(`Erreur insertion: ${insertErr.message}`)
          } else {
            oppsAdded++
          }
        }

        // Mettre a jour la source
        await supabase
          .from('sources_veille')
          .update({ derniere_verification: new Date().toISOString() })
          .eq('id', source.id)

      } catch (err: any) {
        details.push(`Erreur sur source ${source.nom}: ${err.message}`)
      }
    }

    // Log success
    await supabase.from('logs_veille').insert({
      type_cron: 'veille_ia',
      sources_traitees: sourcesProcessed,
      opportunites_ajoutees: oppsAdded,
      statut: 'succes',
      details: details.join('\n')
    })

  } catch (globalErr: any) {
    // Log fatal error
    await supabase.from('logs_veille').insert({
      type_cron: 'veille_ia',
      statut: 'erreur',
      details: globalErr.message
    })
  }
}

async function runRecheckLiens(env: Env) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)
  
  let checked = 0
  let expired = 0
  let deadLinks = 0

  try {
    // On recupere les opportunites 'a_jour' (publiees ou detectees)
    const { data: opps } = await supabase
      .from('opportunites')
      .select('id, deadline, lien_source')
      .eq('statut_fraicheur', 'a_jour')

    const now = new Date()

    for (const opp of opps || []) {
      checked++
      let needsUpdate = false
      let newStatut = 'a_jour'

      // Check deadline
      if (opp.deadline && new Date(opp.deadline) < now) {
        newStatut = 'expiree'
        needsUpdate = true
        expired++
      } else {
        // Check lien
        try {
          // Utilisation de GET au lieu de HEAD car beaucoup de serveurs bloquent HEAD
          const res = await fetch(opp.lien_source, { method: 'GET', headers: { 'User-Agent': 'YouthLinkia-Bot/1.0' } })
          if (!res.ok) {
            newStatut = 'a_verifier'
            needsUpdate = true
            deadLinks++
          }
        } catch (e) {
          newStatut = 'a_verifier'
          needsUpdate = true
          deadLinks++
        }
      }

      if (needsUpdate) {
        await supabase
          .from('opportunites')
          .update({ statut_fraicheur: newStatut })
          .eq('id', opp.id)
      }
    }

    await supabase.from('logs_veille').insert({
      type_cron: 'recheck_liens',
      statut: 'succes',
      details: `Vérifiés: ${checked}. Expirés: ${expired}. Liens morts: ${deadLinks}`
    })

  } catch (err: any) {
    await supabase.from('logs_veille').insert({
      type_cron: 'recheck_liens',
      statut: 'erreur',
      details: err.message
    })
  }
}
