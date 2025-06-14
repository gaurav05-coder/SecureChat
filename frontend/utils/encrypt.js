// AES encryption/decryption helpers using Web Crypto API

// Converts string to ArrayBuffer
function str2ab(str) {
  return new TextEncoder().encode(str);
}
// Converts ArrayBuffer to base64
function ab2b64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}
// Converts base64 to ArrayBuffer
function b642ab(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

export async function generateAESKey() {
  return await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptAES(plaintext, key) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder().encode(plaintext);
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc
  );
  return {
    iv: ab2b64(iv),
    ciphertext: ab2b64(ciphertext)
  };
}

export async function decryptAES({ ciphertext, iv }, key) {
  const ct = b642ab(ciphertext);
  const ivbuf = b642ab(iv);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivbuf },
    key,
    ct
  );
  return new TextDecoder().decode(decrypted);
}
