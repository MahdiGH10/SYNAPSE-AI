const http = require('http');

(async () => {
  // Use the built-in fetch and FormData available in Node 18+
  const form = new FormData();
  // Create a Blob from the buffer so FormData accepts it in Node's fetch
  const fileBlob = new Blob([Buffer.from('Exemple de contenu de test')], {
    type: 'text/plain',
  });
  form.append('file', fileBlob, 'test.txt');
  form.append('type', 'qcm');
  form.append('count', '3');

  const res = await fetch('http://localhost:3000/api/gemini', {
    method: 'POST',
    body: form,
  });
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', text);
})();
