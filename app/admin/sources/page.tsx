import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { saveSource, deleteSource } from '../opportunites-actions'

export default async function SourcesPage() {
  const supabase = await createClient()

  const { data: sources } = await supabase
    .from('sources_veille')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-gray-900">Sources de Veille</h1>
          <p className="text-gray-600">
            Gérez les sources qui alimentent la détection des opportunités (Module IA).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-bold font-poppins text-gray-900 mb-4">Ajouter une source</h2>
            <form action={saveSource} className="space-y-4">
              <Input 
                id="nom" 
                name="nom" 
                label="Nom de la source" 
                placeholder="Ex: Campus France" 
                required 
              />
              <Input 
                id="url" 
                name="url" 
                label="URL" 
                type="url"
                placeholder="https://www.campusfrance.org" 
                required 
              />
              <Input 
                id="score_confiance" 
                name="score_confiance" 
                label="Score de confiance (0.00 à 1.00)" 
                type="number"
                step="0.05"
                min="0"
                max="1"
                defaultValue="0.50" 
                required 
              />
              <Button type="submit" className="w-full">Enregistrer la source</Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Source</th>
                  <th className="px-6 py-3 font-semibold">Score</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sources?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      Aucune source configurée.
                    </td>
                  </tr>
                )}
                {sources?.map((source) => (
                  <tr key={source.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{source.nom}</div>
                      <a href={source.url} target="_blank" className="text-xs text-primary-600 hover:underline">{source.url}</a>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        source.score_confiance >= 0.8 ? 'bg-success-100 text-success-800' :
                        source.score_confiance >= 0.5 ? 'bg-warning-100 text-warning-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {source.score_confiance.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={deleteSource}>
                        <input type="hidden" name="id" value={source.id} />
                        <Button type="submit" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 text-xs px-2 h-8">
                          Supprimer
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  )
}
