document.getElementById('inasistencia-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('.btn-submit');
    const webhookUrl = 'http://localhost:5678/webhook-test/justificacion';

    // Bloquear el botón para evitar envíos duplicados mientras procesa n8n
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    // Serializa automáticamente inputs, selects, textareas y archivos adjuntos
    const formData = new FormData(form);

    try {
        // Ejecución de la petición HTTP POST hacia el webhook de n8n
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: formData 
            // Nota: No se define 'Content-Type' manualmente; el navegador lo hace 
            // automáticamente al usar FormData incluyendo el boundary del archivo.
        });

        // Validación de Error HTTP (Respuestas 4xx o 5xx desde n8n)
        if (!response.ok) {
            throw new Error(`Error HTTP de n8n. Estado: ${response.status} - ${response.statusText}`);
        }

        // Procesamiento del éxito
        alert('Formulario enviado correctamente. Su justificación está en revisión.');
        form.reset();

    } catch (error) {
        // Depuración avanzada: Captura fallos de red, CORS o rechazos del servidor n8n
        console.error('--- DEPURACIÓN FORMULARIO N8N ---');
        console.error('Mensaje de error:', error.message);
        console.error('Stack Trace:', error.stack);
        
        alert(`No se pudo enviar la solicitud. Error para depuración: ${error.message}`);
    } finally {
        // Restaurar el estado del botón sin importar si hubo éxito o fallo
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar formulario';
    }
});
