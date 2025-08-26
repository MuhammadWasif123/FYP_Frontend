import forge from "node-forge";

export async function encryptReportData(data) {
  //Loading the public key from the backend API
  const res = await fetch("http://localhost:3004/api/v1/key/public");
  const publicKeyPem = await res.text();
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

  // 2. Generate AES key (32 bytes = 256-bit)
  const aesKey = forge.random.getBytesSync(32);

  // 3. Encrypt data with AES (AES-CBC mode)
  const iv = forge.random.getBytesSync(16);
  const cipher = forge.cipher.createCipher("AES-CBC", aesKey);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(JSON.stringify(data), "utf8"));
  cipher.finish();
  const encryptedData = cipher.output.getBytes();

  // 4. Encrypt AES key with RSA public key (RSA-OAEP padding)
  const encryptedKey = publicKey.encrypt(aesKey, "RSA-OAEP");

  return {
    encryptedKey: btoa(encryptedKey),
    iv: btoa(iv),
    encryptedData: btoa(encryptedData),
  };
}
