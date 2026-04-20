import { verifyJWT } from './_jwt.js';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

async function getUser(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  return verifyJWT(token, env.JWT_SECRET);
}

export async function onRequestGet({ request, env }) {
  const user = await getUser(request, env);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: cors });

  const row = await env.DB.prepare('SELECT state_json FROM user_state WHERE user_id = ?').bind(user.sub).first();
  return new Response(row ? row.state_json : 'null', { headers: cors });
}

export async function onRequestPut({ request, env }) {
  const user = await getUser(request, env);
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: cors });

  const body = await request.text();
  await env.DB.prepare(
    'INSERT INTO user_state (user_id, state_json, updated_at) VALUES (?, ?, unixepoch()) ON CONFLICT(user_id) DO UPDATE SET state_json = excluded.state_json, updated_at = excluded.updated_at'
  ).bind(user.sub, body).run();

  return new Response(JSON.stringify({ ok: true }), { headers: cors });
}

export async function onRequestOptions() {
  return new Response(null, { headers: { ...cors, 'Access-Control-Allow-Methods': 'GET,PUT' } });
}
