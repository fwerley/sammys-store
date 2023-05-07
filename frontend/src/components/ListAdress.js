export default function ListAdress({ arrayAdrees, onChangeView, searching }) {
    const viewAddress = (e) => {
        onChangeView(e);
    }
    return (
        <div className='d-flex list-container-address flex-column'>
            {
                arrayAdrees.map((item) => (
                    <div className='d-flex align-items-center' key={item.place_id} onClick={() => viewAddress([item.lon, item.lat])}>
                        <i className="fa-sharp fa-solid fa-location-dot me-2"></i>
                        {item.name.substr(0, 60)}...
                    </div>
                ))
            }
            {
                searching && arrayAdrees.length === 0 ? (
                    <div className='d-flex align-items-center'>
                        <i className="fa-sharp fa-solid fa-location-dot me-2"></i>
                        Endereço não encontrado
                    </div>
                ) : ''
            }
        </div>
    )
}
