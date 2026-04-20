import { verifyPassword } from '../_hash.js';
import { signJWT } from '../_jwt.js';

const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

export async function onRequestPost({ request, env }) {
  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !password) return new Response(JSON.stringify({ error: 'Email and password required' }), { status: 400, headers: cors });

  const user = await env.DB.prepare('SELECT id, password_hash FROM users WHERE email = ?').bind(email.toLowerCase()).first();
  if (!user) return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401, headers: cors });

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401, headers: cors });

  const token = await signJWT({ sub: user.id, email: email.toLowerCase() }, env.JWT_SECRET);
  return new Response(JSON.stringify({ token }), { headers: cors });
}

export async function onRequestOptions() {
  return new Response(null, { headers: { ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' } });
}
