export default function AdvertsManager() {
    return(
    <div>
        <h1>Anuncios</h1>
        <h2>Visibles</h2>
        <div className="advert-internal-card"
            style={{
                display: 'flex',
                flexDirection:'column',
                justifyContent: 'left',
                position: 'relative',
                width: "100%",
                height: "20vh",
                border: "1px solid var(--accent-border)",
            }}
        >
            <h3 style={{ margin: 10, textAlign: 'left' }}>Collar para hombre</h3>
            <img 
                style={{
                    height: "80%",
                }}
                src="@src/assets/square_placeholder.jpeg"
                alt="Collar para hombre" />
        </div>
    </div>
    )
}