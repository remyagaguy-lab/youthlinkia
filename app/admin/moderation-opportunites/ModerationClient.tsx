'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { moderateOpportunite, saveOpportunite } from '../opportunites-actions'

type Opportunite = any // Ideally fully typed

export default function ModerationClient({ initialOpportunites }: { initialOpportunites: Opportunite[] }) {
  const [opportunites, setOpportunites] = useState<Opportunite[]>(initialOpportunites)
  const [filter, setFilter] = useState<string>('a_valider')
  const [editingOpp, setEditingOpp] = useState<Opportunite | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    // Enable Realtime
    const channel = supabase.channel('realtime_opportunites')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'opportunites' },
        (payload) => {
          console.log('Realtime update received!', payload)
          if (payload.eventType === 'INSERT') {
            setOpportunites((prev) => [payload.new, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setOpportunites((prev) => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o))
          } else if (payload.eventType === 'DELETE') {
            setOpportunites((prev) => prev.filter(o => o.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const filtered = opportunites.filter(o => o.statut_moderation === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {['detecte', 'a_valider', 'publie', 'rejete'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-full ${
                filter === status 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.replace('_', ' ').toUpperCase()}
              <span className="ml-2 opacity-75">
                ({opportunites.filter(o => o.statut_moderation === status).length})
              </span>
            </button>
          ))}
        </div>
        <Button onClick={() => setEditingOpp({})} variant="outline">
          + Création Manuelle
        </Button>
      </div>

      {editingOpp && (
        <Card className="p-6 border-primary-500 border-2 bg-primary-50 shadow-lg">
          <h2 className="text-xl font-bold mb-4">{editingOpp.id ? 'Éditer l\'opportunité' : 'Nouvelle opportunité'}</h2>
          <form action={(formData) => { saveOpportunite(formData); setEditingOpp(null); }} className="space-y-4">
            {editingOpp.id && <input type="hidden" name="id" value={editingOpp.id} />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="titre" label="Titre" defaultValue={editingOpp.titre} required />
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select name="type" defaultValue={editingOpp.type || ''} required className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white">
                  <option value="">Sélectionnez...</option>
                  <option value="bourse_etude">Bourse d'étude</option>
                  <option value="emploi">Emploi</option>
                  <option value="formation_courte">Formation courte</option>
                  <option value="volontariat">Volontariat</option>
                  <option value="financement">Financement</option>
                  <option value="concours">Concours</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" rows={3} defaultValue={editingOpp.description} required className="rounded-md border border-gray-300 px-3 py-2 text-sm w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input name="lien_source" label="Lien source" type="url" defaultValue={editingOpp.lien_source} required />
              <Input name="deadline" label="Deadline" type="date" defaultValue={editingOpp.deadline ? editingOpp.deadline.split('T')[0] : ''} />
              <Input name="montant_couverture" label="Montant / Couverture" defaultValue={editingOpp.montant_couverture} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="pays_eligibles_residence" label="Pays éligibles (séparés par virgule)" defaultValue={editingOpp.pays_eligibles_residence?.join(', ')} />
              <Input name="tags" label="Tags (séparés par virgule)" defaultValue={editingOpp.tags?.join(', ')} />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingOpp(null)}>Annuler</Button>
              <Button type="submit">Sauvegarder et Publier</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center p-8 bg-white border rounded-lg text-gray-500">Aucune opportunité avec ce statut.</div>
        )}
        
        {filtered.map(opp => (
          <Card key={opp.id} className="p-5 flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex-grow space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{opp.titre}</h3>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium uppercase">{opp.type.replace('_', ' ')}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{opp.description}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>🗓 Deadline: {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'N/A'}</span>
                <span>🌍 Pays: {opp.pays_eligibles_residence?.length > 0 ? opp.pays_eligibles_residence.join(', ') : 'Tous'}</span>
                <span>🔗 <a href={opp.lien_source} target="_blank" className="text-primary-600 hover:underline">Lien source</a></span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 min-w-[150px]">
              <Button onClick={() => setEditingOpp(opp)} variant="outline" size="sm" className="w-full">
                Éditer
              </Button>
              {(filter === 'detecte' || filter === 'a_valider') && (
                <form action={moderateOpportunite} className="flex flex-col gap-2">
                  <input type="hidden" name="id" value={opp.id} />
                  <Button type="submit" name="action" value="valider" size="sm" className="w-full bg-success-600 hover:bg-success-700">Valider</Button>
                  <Button type="submit" name="action" value="rejeter" size="sm" variant="outline" className="w-full text-red-600 border-red-200">Rejeter</Button>
                </form>
              )}
              {filter === 'publie' && (
                <form action={moderateOpportunite}>
                  <input type="hidden" name="id" value={opp.id} />
                  <Button type="submit" name="action" value="rejeter" size="sm" variant="outline" className="w-full text-warning-600 border-warning-200">Suspendre</Button>
                </form>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
