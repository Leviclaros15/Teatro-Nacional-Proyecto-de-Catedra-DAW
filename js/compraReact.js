
const EVENTOS_DISPONIBLES = [
    { id: 'figaro', titulo: "Fígaro, Viva la Ópera", fecha: "Sábado 22 de marzo", sala: "Sala de Cámara" },
    { id: 'bella', titulo: "La bella y la bestia", fecha: "Domingo 23 de marzo", sala: "Teatro Principal" },
    { id: 'concierto', titulo: "Concierto de la Orquesta", fecha: "Viernes 21 de marzo", sala: "Teatro Principal" },
];

const getEvento = (id) => EVENTOS_DISPONIBLES.find(e => e.id === id);

const QRCodeDisplay = ({ qrContent, eventoTitulo }) => {
    const qrRef = React.useRef(null);

    React.useEffect(() => {
        if (qrRef.current) {
            qrRef.current.innerHTML = ''; 
            
            new QRCode(qrRef.current, {
                text: qrContent,
                width: 110,
                height: 110,
                colorDark : "#181818",
                colorLight : "#f9f9f9",
                correctLevel : QRCode.CorrectLevel.H
            });
        }
    }, [qrContent]);

    return (
        <div style={{ padding: '15px', marginTop: '15px', background: '#333537', borderRadius: '8px', border: '1px solid #bfa14a33', textAlign: 'center' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#dcd6b8' }}>
                **QR adjunto (Simulado):** Escanea para ver detalles de **{eventoTitulo}**
            </p>
            <div ref={qrRef} style={{ margin: '0 auto', width: '110px', height: '110px' }}></div>
        </div>
    );
};

const FormularioCompra = () => {

    const [nombre, setNombre] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [selectedFuncionId, setSelectedFuncionId] = React.useState('');
    const [selectedTipo, setSelectedTipo] = React.useState('');
    const [cantidad, setCantidad] = React.useState(1);
    
    const [isLoading, setIsLoading] = React.useState(false);
    const [confirmation, setConfirmation] = React.useState(null);

    // Lógica para calcular precios (copiada y adaptada de tu JS original)
    const calcularPrecios = () => {
        let precioUnitario = 0;
        switch (selectedTipo.toLowerCase()) {
            case "general": precioUnitario = 5.0; break;
            case "preferencial": precioUnitario = 8.0; break;
            case "vip": precioUnitario = 12.0; break;
            default: precioUnitario = 0;
        }

        const subtotal = +(precioUnitario * cantidad).toFixed(2);
        const impuestos = +(subtotal * 0.13).toFixed(2);
        const total = +(subtotal + impuestos).toFixed(2);
        
        return { precioUnitario, subtotal, impuestos, total };
    };

    const { total } = calcularPrecios();

    // Función de envío 
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación básica (el resto lo hace el input)
        if (!nombre || !email || !selectedFuncionId || !selectedTipo || cantidad < 1 || cantidad > 10) {
            mostrarError("Por favor, completa todos los campos y revisa la cantidad.");
            return;
        }
        
        const nombreRe = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s-]+$/;
        if (!nombreRe.test(nombre)) {
            mostrarError("El nombre solo puede contener letras, espacios y guiones.");
            return;
        }

        setIsLoading(true);
        const selectedEvent = getEvento(selectedFuncionId);
        const precios = calcularPrecios();
        
        // **Simulación AJAX (Punto 4)*
        await new Promise(resolve => setTimeout(resolve, 2000)); 

        setIsLoading(false);

        const compra = {
            nombre: nombre,
            correo: email,
            funcion: selectedEvent.titulo,
            tipo: selectedTipo,
            cantidad: cantidad,
            precioUnitario: precios.precioUnitario,
            subtotal: precios.subtotal,
            impuestos: precios.impuestos,
            total: precios.total,
            fecha: new Date().toLocaleString()
        };

        // Guardar en localStorage 
        let compras = JSON.parse(localStorage.getItem("compras")) || [];
        compras.push(compra);
        localStorage.setItem("compras", JSON.stringify(compras));
        
        // Generar la confirmación y mostrar el resumen
        setConfirmation({
            nombre: nombre,
            eventoTitulo: selectedEvent.titulo,
            qrLink: window.location.href, // QR dirige a la página actual
            total: precios.total,
            email: email,
        });
        
        Swal.fire({
            title: "¡Compra procesada! ✅",
            html: `Se ha simulado el envío de su boleto a <b>${email}</b>. Total pagado: <b>${formatMoneda(precios.total)}</b>.`,
            icon: "success",
            confirmButtonColor: "#bfa14a",
            background: '#232526',
            color: '#f5f5f5'
        });
    };
    

    if (confirmation) {
        // Muestra el resumen (simulación del correo enviado)
        return (
            <div className="resumen-compra">
                <h2>✅ Compra Exitosa - Correo Enviado</h2>
                <div className="detalle" style={{border: 'none'}}>
                    <p style={{ color: '#d6c98a', lineHeight: '1.5', margin: '10px 0' }}>
                        ¡Felicidades, **{confirmation.nombre}**!
                        <br/>Tu boleto para la función **"{confirmation.eventoTitulo}"** ha sido **enviado a {confirmation.email} (Simulado)**.
                    </p>
                </div>
                
                {/* Texto del correo simplificado solicitado */}
                <blockquote style={{ borderLeft: '3px solid #bfa14a', paddingLeft: '15px', margin: '15px 0', fontSize: '0.95rem', color: '#f5f5f5' }}>
                    *Cuerpo del Correo:* "Gracias por tu compra del boleto para **{confirmation.eventoTitulo}**. Presenta el código QR adjunto para ingresar al Teatro Nacional."
                </blockquote>
                
                <QRCodeDisplay 
                    qrContent={confirmation.qrLink} 
                    eventoTitulo={confirmation.eventoTitulo}
                />
                
                <button 
                    onClick={() => setConfirmation(null)} 
                    style={{ marginTop: '20px', padding: '12px 0' }}
                >
                    Comprar otro boleto
                </button>
            </div>
        );
    }

    // Muestra el formulario de compra (usando tus clases CSS)
    return (
        <form onSubmit={handleSubmit} className="formulario-boletos">
            {/* Campo Nombre */}
            <div className="campo">
                <label htmlFor="reactNombre">Nombre del comprador:</label>
                <input 
                    type="text" id="reactNombre" name="nombre" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    placeholder="Tu nombre completo" required 
                    disabled={isLoading}
                />
            </div>

            {/* Campo Email */}
            <div className="campo">
                <label htmlFor="reactCorreo">Correo electrónico:</label>
                <input 
                    type="email" id="reactCorreo" name="correo" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="ejemplo@correo.com" required 
                    disabled={isLoading}
                />
            </div>

            {/* Combobox de Función */}
            <div className="campo">
                <label htmlFor="reactFuncion">Función:</label>
                <select 
                    id="reactFuncion" name="funcion" 
                    value={selectedFuncionId} 
                    onChange={(e) => setSelectedFuncionId(e.target.value)}
                    required
                    disabled={isLoading}
                >
                    <option value="">-- Selecciona una función --</option>
                    {EVENTOS_DISPONIBLES.map(evento => (
                        <option key={evento.id} value={evento.id}>
                            {evento.titulo}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* Tipo de asiento */}
            <div className="campo">
                <label htmlFor="reactTipo">Tipo de asiento:</label>
                <select 
                    id="reactTipo" name="tipo" 
                    value={selectedTipo}
                    onChange={(e) => setSelectedTipo(e.target.value)}
                    required disabled={isLoading}
                >
                    <option value="">-- Selecciona tipo --</option>
                    <option value="General">General ($5.00 + IVA)</option>
                    <option value="Preferencial">Preferencial ($8.00 + IVA)</option>
                    <option value="VIP">VIP ($12.00 + IVA)</option>
                </select>
            </div>

            {/* Cantidad de boletos */}
            <div className="campo">
                <label htmlFor="reactCantidad">Cantidad de boletos:</label>
                <input 
                    type="number" id="reactCantidad" name="cantidad" 
                    min="1" max="10" value={cantidad} 
                    onChange={(e) => setCantidad(parseInt(e.target.value, 10))}
                    required disabled={isLoading}
                />
            </div>
            
            {/* Total (Se muestra en tiempo real) */}
            {selectedTipo && cantidad >= 1 && (
                <div style={{ padding: '10px 0', borderTop: '1px solid #333', marginTop: '15px' }}>
                    <p style={{ color: '#bfa14a', fontWeight: 'bold', textAlign: 'right', fontSize: '1.2rem' }}>
                        TOTAL ESTIMADO: {formatMoneda(total)}
                    </p>
                </div>
            )}
            
            <div className="acciones">
                <button type="submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
                    {isLoading ? 'Simulando Compra y Envío...' : 'Comprar Boleto y Enviar Correo (Simulado)'}
                </button>
            </div>
        </form>
    );
};


// 4. Montar el componente React
const container = document.getElementById('react-compra-root'); 
// El ID 'react-compra-root' debe coincidir con el div en tu HTML
const root = ReactDOM.createRoot(container);
root.render(<FormularioCompra />);