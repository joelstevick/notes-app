import App from './App';
import NotesPage, { loader as notesLoader, action as notesAction } from './NotesPage';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <NotesPage />,
        loader: notesLoader,
        action: notesAction,
      },
    ],
  },
];

export default routes;