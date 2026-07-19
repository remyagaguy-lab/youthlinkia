import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { moderateStructure } from '../actions'
import Link from 'next/link'

export default async function ModerationPage() {
  const supabase = await createClient()

  const { data: structures } = await supabase
    .from('structures')
    .select(`
      id, nom, mission, type, lien, contact, partenaire_id, created_at,
      profiles:partenaire_id(prenom)
    `)
    .eq('statut', 'a_valider')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-poppins text-gray-900">Modération des Partenaires</h1>
        <p className="text-gray-600">
          Validez ou rejetez les fiches structures soumises par les nouveaux partenaires.
        </p>
      </div>

      <div className="space-y-6">
        {structures?.length === 0 && (
          <div className="text-center p-12 bg-white rounded-lg border border-gray-200 shadow-sm text-gray-500">
            Aucune fiche en attente de modération.
          </div>
        )}

        {structures?.map((structure) => (
          <Card key={structure.id} className="p-6">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
              <div className="flex-grow space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">{structure.nom}</h2>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium uppercase">{structure.type.replace('_', ' ')}</span>
                </div>
                <p className="text-gray-700 text-sm">{structure.mission}</p>
                <div className="text-sm text-gray-500 mt-2 flex flex-wrap gap-4">
                  <span>✉️ {structure.contact}</span>
                  <span>🔗 <a href={structure.lien} target="_blank" className="hover:underline text-primary-600">{structure.lien}</a></span>
                  {/* Note: In a real app we'd fetch profile email, but here we just show what we have in the query */}
                  <span>👤 Soumis par: {structure.profiles?.prenom}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[250px] bg-gray-50 p-4 rounded-lg border border-gray-200">
                <form action={moderateStructure}>
                  <input type="hidden" name="id" value={structure.id} />
                  <input type="hidden" name="partenaire_id" value={structure.partenaire_id} />
                  
                  <div className="flex flex-col gap-2 mb-4">
                    <Button type="submit" name="action" value="valider" className="w-full bg-success-600 hover:bg-success-700">
                      Valider et Publier
                    </Button>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-700">Motif de rejet (obligatoire si rejet)</label>
                    <textarea 
                      name="motif"
                      rows={2}
                      className="w-full text-sm border-gray-300 rounded-md focus:border-red-500 focus:ring-red-500"
                      placeholder="Ex: Le lien du site web est invalide..."
                    ></textarea>
                    <Button type="submit" name="action" value="rejeter" variant="outline" className="w-full text-red-700 border-red-200 hover:bg-red-50">
                      Rejeter la fiche
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
