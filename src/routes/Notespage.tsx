import { useLoaderData, Form } from 'react-router-dom';
import { LoaderFunctionArgs, ActionFunctionArgs, redirect } from 'react-router-dom';
import { db } from '../db/db';
import { notes } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function loader() {
  return await db.select().from(notes);
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get('_intent');

  if (intent === 'create') {
    const title = form.get('title') as string;
    const content = form.get('content') as string;
    await db.insert(notes).values({ title, content });
  }

  if (intent === 'delete') {
    const id = Number(form.get('id'));
    await db.delete(notes).where(eq(notes.id, id));
  }

  return redirect('/');
}

export default function NotesPage() {
  const notesList = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <div>
      <Form method="post" className="space-y-2 mb-6">
        <input name="title" placeholder="Title" required className="block w-full border px-2 py-1" />
        <textarea name="content" placeholder="Content" required className="block w-full border px-2 py-1" />
        <button type="submit" name="_intent" value="create" className="bg-blue-600 text-white px-4 py-2">Create</button>
      </Form>

      <ul className="space-y-4">
        {notesList.map(note => (
          <li key={note.id} className="border p-3 rounded shadow-sm">
            <div className="font-semibold">{note.title}</div>
            <div>{note.content}</div>
            <Form method="post" className="mt-2">
              <input type="hidden" name="id" value={note.id} />
              <button type="submit" name="_intent" value="delete" className="text-red-600 text-sm">Delete</button>
            </Form>
          </li>
        ))}
      </ul>
    </div>
  );
}