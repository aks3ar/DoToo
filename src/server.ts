import express, { json, Request, Response } from 'express';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';

import {
  clear
} from './clear';

import {
  tagList,
  tagName,
  tagDelete,
  tagCreate
} from './tag';

import {
  todoDetails,
  // todoDelete,
  todoCreate,
  // todoUpdate,
  // todoList,
  // todoBulk
} from './todo';

// import {
//   summary,
//   notifications
// } from './other';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// for logging errors (print to terminal)
app.use(morgan('dev'));

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/example/route', (req: Request, res: Response) => {
  return res.json({ message: 'Hi' });
});

app.delete('/clear', (req: Request, res: Response) => {
  const response = clear();
  res.json(response);
});

app.get('/tag/list', (req: Request, res: Response) => {
  const response = tagList();
  if ('error' in response) {
    res.status(response.code).json({ error: response.error });
    return;
  }
  res.json(response);
});

app.get('/tag', (req: Request, res: Response) => {
  const tagId = parseInt(req.query.tagId as string);
  const response = tagName(tagId);
  if ('error' in response) {
    res.status(response.code).json({ error: response.error });
    return;
  }
  res.json(response);
});

app.delete('/tag', (req: Request, res: Response) => {
  const tagId = parseInt(req.query.tagId as string);
  const response = tagDelete(tagId);
  if ('error' in response) {
    res.status(response.code).json({ error: response.error });
    return;
  }
  res.json(response);
});

app.post('/tag', (req: Request, res: Response) => {
  const { name } = req.body;
  const response = tagCreate(name);
  if ('error' in response) {
    res.status(response.code).json({ error: response.error });
    return;
  }
  res.json(response);
});

app.get('/todo/item', (req: Request, res: Response) => {
  const todoItemId = parseInt(req.query.todoItemId as string);
  const response = todoDetails(todoItemId);
  if ('error' in response) {
    res.status(response.code).json({ error: response.error });
    return;
  }
  res.json(response);
});

// app.delete('/todo/item', (req: Request, res: Response) => {
//   const todoItemId = parseInt(req.query.todoItemId as string);
//   const response = todoDelete(todoItemId);
//   if ('error' in response) {
//     res.status(response.code).json({ error: response.error });
//     return;
//   }
//   res.json(response);
// });

app.post('/todo/item', (req: Request, res: Response) => {
  const { description, parentId } = req.body;
  const response = todoCreate(description, parentId);
  if ('error' in response) {
    res.status(response.code).json({ error: response.error });
    return;
  }
  res.json(response);
});

// app.put('/todo/item', (req: Request, res: Response) => {
//   const { todoItemId, description, tagIds, status, parentId, deadline } = req.body;
//   const response = todoUpdate(todoItemId, description, tagIds, status, parentId, deadline);
//   if ('error' in response) {
//     res.status(response.code).json({ error: response.error });
//     return;
//   }
//   res.json(response);
// });

// app.get('/todo/list', (req: Request, res: Response) => {
//   const parentId = req.query.parentId as string;
//   const tagIds = JSON.parse(req.query.tagIds as string) as number[];
//   const status = req.query.status as string;
//   const response = todoList(parentId, tagIds, status);
//   if ('error' in response) {
//     res.status(response.code).json({ error: response.error });
//     return;
//   }
//   res.json(response);
// });

// app.post('/todo/item/bulk', (req: Request, res: Response) => {
//   const { bulkString } = req.body;
//   const response = todoBulk(bulkString);
//   if ('error' in response) {
//     res.status(response.code).json({ error: response.error });
//     return;
//   }
//   res.json(response);
// });

// app.get('/summary', (req: Request, res: Response) => {
//   const step = req.query.step as string;
//   const response = summary(step);
//   if ('error' in response) {
//     res.status(response.code).json({ error: response.error });
//     return;
//   }
//   res.json(response);
// });

// app.get('/notifications', (req: Request, res: Response) => {
//   const response = notifications();
//   if ('error' in response) {
//     res.status(response.code).json({ error: response.error });
//     return;
//   }
//   res.json(response);
// });

// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
