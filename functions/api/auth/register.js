import { hashPassword } from '../_hash.js';
import { signJWT } from '../_jwt.js';

const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

export async function onRequestPost({ request, env }) {
  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !password) return new Response(JSON.stringify({ error: 'Email and password required' }), { status: 400, headers: cors });
  if (password.length < 8) return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), { status: 400, headers: cors });

  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase()).first();
  if (existing) return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 409, headers: cors });

  const id = crypto.randomUUID();
  const password_hash = await hashPassword(password);
  await env.DB.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)').bind(id, email.toLowerCase(), password_hash).run();

  const token = await signJWT({ sub: id, email: email.toLowerCase() }, env.JWT_SECRET);
  return new Response(JSON.stringify({ token }), { status: 201, headers: cors });
}

export async function onRequestOptions() {
  return new Response(null, { headers: { ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' } });
}
