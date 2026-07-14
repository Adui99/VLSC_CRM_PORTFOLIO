const url = "https://script.google.com/macros/s/AKfycbyT83bxd18Svn4KLzfjUcMnKc3A19Ff0u_O57tFXmMWcqD9t7aXkVJPSNlfQpnqHCrXJw/exec";
const payload = { name: "Test Node", email: "node@test.com", message: "Hello" };

fetch(url, {
  method: "POST",
  body: JSON.stringify(payload),
  headers: { "Content-Type": "text/plain" }
}).then(res => res.text()).then(console.log).catch(console.error);
