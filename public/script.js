document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const codigo = formData.get('codigo');
    const stock = formData.get('stock');
  
    try {
        // Primero, subir el producto completo
        const productResponse = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            body: formData,
        });
  
        const productResult = await productResponse.json();
  
        if (productResponse.ok) {
            // Si el producto se subió correctamente, actualizar el stock
            const stockResponse = await fetch('http://localhost:3003/api/stock/stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    codigo: codigo,
                    cantidad: parseInt(stock) || 0  // Asegurar que sea número
                }),
            });

            const stockResult = await stockResponse.json();

            if (stockResponse.ok) {
                document.getElementById('response').innerHTML = `
                    <p style="color: green;">${productResult.message}</p>
                    <p style="color: green;">Stock actualizado: ${stockResult.cantidadTotal}</p>
                `;
            } else {
                document.getElementById('response').innerHTML = `
                    <p style="color: green;">${productResult.message}</p>
                    <p style="color: orange;">Producto subido pero hubo un error al actualizar el stock: ${stockResult.mensaje}</p>
                `;
            }
            e.target.reset();
        } else {
            document.getElementById('response').innerHTML = `<p style="color: red;">${productResult.error}</p>`;
        }
    } catch (error) {
        document.getElementById('response').innerHTML = `<p style="color: red;">Error al subir el producto</p>`;
        console.error(error);
    }
});