document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
  
    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        document.getElementById('response').innerHTML = `<p style="color: green;">${result.message}</p>`;
        e.target.reset();
      } else {
        document.getElementById('response').innerHTML = `<p style="color: red;">${result.error}</p>`;
      }
    } catch (error) {
      document.getElementById('response').innerHTML = `<p style="color: red;">Error al subir el producto</p>`;
      console.error(error);
    }
  });