document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-contacto');
    const respuesta = document.getElementById('respuesta');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita recarga

        const formData = new FormData(form);

        fetch('https://formspree.io/f/xwprjodk', { 
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                respuesta.innerText = '¡Formulario enviado correctamente!';
                respuesta.style.color = 'green';
                form.reset();
            } else {
                respuesta.innerText = 'Ocurrió un error al enviar el formulario.';
                respuesta.style.color = 'red';
            }
            setTimeout(() => {
                respuesta.innerText = '';
            }, 3000);
        })
        .catch(error => {
            respuesta.innerText = 'Ocurrió un error al enviar el formulario.';
            respuesta.style.color = 'red';
            console.error('Error:', error);
            setTimeout(() => {
                respuesta.innerText = '';
            }, 3000);
        });
    });
});
