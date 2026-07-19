"use client"

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/Card'
import { upsertArticle, deleteArticle } from './actions'

export function ArticlesClient({ articles }: { articles: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleEdit = (id: string) => {
    setEditingId(id)
    setIsCreating(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cet article ?")) {
      startTransition(async () => {
        await deleteArticle(id)
      })
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      try {
        await upsertArticle(formData)
        setEditingId(null)
        setIsCreating(false)
      } catch (err: any) {
        alert(err.message)
      }
    })
  }

  const activeArticle = articles.find(a => a.id === editingId)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-poppins text-gray-900">Gestion des Articles (Filières)</h1>
        {!isCreating && !editingId && (
          <button 
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
          >
            + Nouvel Article
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <Card className="p-6 border-primary-200 shadow-md">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Modifier l\'article' : 'Créer un article'}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            {editingId && <input type="hidden" name="id" value={editingId} />}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input required name="titre" defaultValue={activeArticle?.titre} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image de couverture (URL)</label>
                <input type="url" name="image_couverture_url" defaultValue={activeArticle?.image_couverture_url} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Texte alternatif de l'image (Obligatoire pour l'accessibilité)</label>
                <input required type="text" name="image_couverture_alt" defaultValue={activeArticle?.image_couverture_alt} placeholder="Décrivez l'image pour les malvoyants" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                <input required name="slug" defaultValue={activeArticle?.slug} className="w-full p-2 border rounded" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <select required name="categorie" defaultValue={activeArticle?.categorie || 'filieres'} className="w-full p-2 border rounded">
                  <option value="filieres">Filières</option>
                  <option value="tremplin_carriere">Tremplin Carrière (Ancien)</option>
                  <option value="preparation_pro">Préparation Pro (Module 5)</option>
                  <option value="methodologie_entrepreneuriale">Métho Entrepreneuriale (Module 6)</option>
                  <option value="labo_business">Labo du Business (Général)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select required name="statut" defaultValue={activeArticle?.statut || 'brouillon'} className="w-full p-2 border rounded">
                  <option value="brouillon">Brouillon</option>
                  <option value="publie">Publié</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Chapo (Résumé court)</label>
              <textarea required name="chapo" defaultValue={activeArticle?.chapo} className="w-full p-2 border rounded h-20" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Corps (HTML ou Markdown simple)</label>
              <textarea required name="corps" defaultValue={activeArticle?.corps} className="w-full p-2 border rounded h-64 font-mono text-sm" />
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <button 
                type="button" 
                onClick={() => { setIsCreating(false); setEditingId(null) }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
              >
                {isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {!isCreating && !editingId && (
        <Card className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 font-medium">Titre</th>
                <th className="p-4 font-medium">Catégorie</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map(article => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{article.titre}</td>
                  <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{article.categorie}</span></td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${article.statut === 'publie' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {article.statut}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleEdit(article.id)} className="text-primary-600 hover:underline">Modifier</button>
                    <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:underline" disabled={isPending}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">Aucun article trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
