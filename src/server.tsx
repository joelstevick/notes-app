import express from 'express';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server';
import { renderToPipeableStream } from 'react-dom/server';
import routes from './routes';
import { Readable } from 'stream';

const app = express();
const handler = createStaticHandler(routes);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.all('*', async (req, res) => {
  const request = new Request(`http://${req.headers.host}${req.url}`, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body: ['GET', 'HEAD'].includes(req.method) ? null : req.body,
  });

  const context = await handler.query(request);

  // ✅ If it's a Response (redirect, error, etc), convert and send it
  if (context instanceof Response) {
    const body = await context.text();
    res.status(context.status).set(Object.fromEntries(context.headers.entries())).send(body);
    return;
  }

  // ✅ Otherwise, it's a StaticHandlerContext and safe to use
  const router = createStaticRouter(handler.dataRoutes, context);

  const { pipe } = renderToPipeableStream(
    <StaticRouterProvider router={router} context={context} />,
    {
      bootstrapScripts: ['/main.js'],
      onShellReady() {
        res.setHeader('Content-Type', 'text/html');
        pipe(res);
      },
    }
  );
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});