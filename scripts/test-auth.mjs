const base = 'http://localhost:4000';

async function req(path, opts = {}){
  const res = await fetch(base + path, opts);
  const text = await res.text();
  let body;
  try{ body = JSON.parse(text); } catch(e){ body = text; }
  return { status: res.status, body };
}

(async ()=>{
  try{
    console.log('== Register ==');
    let r = await req('/api/auth/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: 'alice@example.com', password: 'secret' }) });
    console.log(r);

    console.log('\n== Login ==');
    r = await req('/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: 'alice@example.com', password: 'secret' }) });
    console.log(r);
    const access = r.body && r.body.accessToken;
    const refresh = r.body && r.body.refreshToken;

    console.log('\n== Protected with access token ==');
    r = await req('/api/auth/protected', { headers: { Authorization: `Bearer ${access}` } });
    console.log(r);

    console.log('\n== Protected with tampered token (should fail) ==');
    r = await req('/api/auth/protected', { headers: { Authorization: `Bearer ${access}x` } });
    console.log(r);

    console.log('\n== Refresh token ==');
    r = await req('/api/auth/refresh-token', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ refreshToken: refresh }) });
    console.log(r);
    const newAccess = r.body && r.body.accessToken;
    const newRefresh = r.body && r.body.refreshToken;

    console.log('\n== Protected with new access token ==');
    r = await req('/api/auth/protected', { headers: { Authorization: `Bearer ${newAccess}` } });
    console.log(r);

    console.log('\n== Logout (revoke new refresh token) ==');
    r = await req('/api/auth/logout', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ refreshToken: newRefresh }) });
    console.log(r);

    console.log('\n== Refresh with revoked token (should fail) ==');
    r = await req('/api/auth/refresh-token', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ refreshToken: newRefresh }) });
    console.log(r);

  }catch(err){
    console.error('Test script error', err);
  }
})();
