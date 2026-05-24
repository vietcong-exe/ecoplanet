// auth/supabase.js
// Inicializa o client Supabase e expõe como window._supabase.
// Depende: SDK @supabase/supabase-js carregado via <script> CDN antes deste arquivo.
//
// COMO CONFIGURAR:
//   1. Acesse seu projeto em https://supabase.com
//   2. Settings → API → copie Project URL e anon public key
//   3. Substitua SUPABASE_URL e SUPABASE_ANON_KEY abaixo

(function () {
  var SUPABASE_URL      = 'https://SEU-PROJETO.supabase.co';
  var SUPABASE_ANON_KEY = 'SUA-ANON-KEY-AQUI';

  if (typeof supabase === 'undefined' || !supabase.createClient) {
    console.warn('[EcoPlanet] SDK Supabase não carregado. Auth desabilitado.');
    return;
  }

  window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
