import { verifyJWT, signJWT } from '../_jwt.js';

const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

export async function onRequestPost({ request, env }) {
  try {
    const auth = request.headers.get('Authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return new Response(JSON.stringify({ error: 'No token' }), { status: 401, headers: cors });

    const payload = await verifyJWT(token, env.JWT_SECRET);
    if (!payload) return new Response(JSON.stringify({ error: 'Invalid or expired token' }), { status: 401, headers: cors });

    const fresh = await signJWT({ sub: payload.sub, email: payload.email }, env.JWT_SECRET);
    return new Response(JSON.stringify({ token: fresh }), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: cors });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' } });
}
