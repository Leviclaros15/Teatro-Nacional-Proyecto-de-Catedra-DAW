// Funciones auxiliares globales para ser utilizadas por React y el Historial
function formatMoneda(n) { return new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(n); }
function escapeHtml(str) { if (!str) return ""; return str.replace(/[&<>"'`=\/]/g, s => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;" })[s]); }
function mostrarError(mensaje) {
    if (typeof Swal !== "undefined") {
        Swal.fire({ icon: "error", title: "Error en el formulario", text: mensaje, confirmButtonColor: "#d4af37", background: '#232526', color: '#f5f5f5' });
    } else { alert(mensaje); }
}

// Historial y contenedores (permanecen en JS nativo)
document.addEventListener("DOMContentLoaded", () => {
    // Nota: El formulario y la sección de resumen ya no existen en el HTML original.
    // Creamos un contenedor genérico para el historial que React no toca.
    const historialContenedor = document.createElement("div");
    historialContenedor.id = "historialCompras";

    const resumenSection = document.getElementById("react-compra-root").parentNode;
    
    // Agregar un título al historial
    const historialTitulo = document.createElement("h2");
    historialTitulo.textContent = "Historial de Compras Anteriores";
    historialTitulo.style.color = '#bfa14a';
    historialTitulo.style.marginTop = '40px';
    
    resumenSection.appendChild(historialTitulo);
    resumenSection.appendChild(historialContenedor);

    mostrarComprasGuardadas();

    // El manejo de validación en tiempo real del nombre también se puede mover a React
    // o eliminarse, ya que React maneja los inputs.

    // form.addEventListener("submit", (event) => { ... }) y form.addEventListener("reset", ...) han sido eliminados.

    // Funciones de historial
    function mostrarComprasGuardadas() {
        const historial = JSON.parse(localStorage.getItem("compras")) || [];
        historialContenedor.innerHTML = historial.length === 0
            ? `<p style="color:#f5f5f5; margin-bottom: 20px;">No hay compras registradas en el historial.</p>`
            : historial.map((c, i) => `
                <div class="resumen-card" style="margin-top: 10px;">
                    <h2>Compra Historial #${i + 1}</h2>
                    <div class="detalle"><span class="etiqueta">Comprador:</span><span class="valor">${escapeHtml(c.nombre)}</span></div>
                    <div class="detalle"><span class="etiqueta">Función:</span><span class="valor">${escapeHtml(c.funcion)}</span></div>
                    <div class="detalle"><span class="etiqueta">Tipo/Cantidad:</span><span class="valor">${escapeHtml(c.tipo)} x ${c.cantidad}</span></div>
                    <div class="total"><span>TOTAL:</span><span>${formatMoneda(c.total)}</span></div>
                    <small style="color: #dcd6b8; display: block; margin-top: 5px;">${c.fecha}</small>
                </div>
            `).join("");
    }
});

// Nota: La función agregarCompraAlHistorial ahora debe llamarse desde React
// después de que el proceso AJAX simulado sea exitoso.
// Usamos localStorage directamente en React.