'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, PlusCircle, StickyNote, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createNoteAction, deleteNoteAction, getNotesAction } from './actions';

type Note = { id: string; title: string; content: string; category?: string; createdAt?: any };

export default function NotesPage() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => { loadNotes(); }, []);

  async function loadNotes() {
    setLoading(true);
    const data = await getNotesAction().catch((e) => { console.error('Data fetch error:', e.message); return []; });
    setNotes(data);
    setLoading(false);
  }

  async function handleAdd() {
    if (!title.trim() || !content.trim()) { toast({ variant:'destructive', title:'Required', description:'Title and content are required.' }); return; }
    setSaving(true);
    try {
      const res = await createNoteAction({ title, content, category });
      if (res.success) { setTitle(''); setContent(''); setCategory(''); loadNotes(); toast({ title:'Note saved' }); }
      else toast({ variant:'destructive', title:'Error', description: res.error });
    } catch (e: any) {
      toast({ variant:'destructive', title:'Error', description: e.message || 'Failed to save note.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteNoteAction(id);
    loadNotes();
    toast({ title:'Note deleted' });
  }

  return (
    <div className="flex-1 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><StickyNote className="h-8 w-8" />General Notes</h1>
        <p className="text-muted-foreground">Store important notes, reminders and operational information</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Add New Note</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Note title..." disabled={saving} /></div>
            <div className="space-y-2"><Label>Category (optional)</Label><Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Operations, HR, Finance..." disabled={saving} /></div>
          </div>
          <div className="space-y-2"><Label>Content</Label><Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your note here..." rows={4} disabled={saving} /></div>
          <Button onClick={handleAdd} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}Save Note</Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : notes.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">No notes yet. Add your first note above.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(n => (
            <Card key={n.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-tight">{n.title}</CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-destructive" onClick={() => handleDelete(n.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
                {n.category && <Badge variant="secondary" className="w-fit text-xs">{n.category}</Badge>}
              </CardHeader>
              <CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{n.content}</p></CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
