import data from "./data";

function App() {
  return (
    <div>
      <header>
        <a href="/">
          <div className="logo-desc">
            <div>Sammy's</div>
            <div>Store</div>
          </div>
        </a>
      </header>
      <main>
        <h1>Produtos em destaque</h1>
        <div className="products">
          {data.products.map(product => (
            <div className="product" key={product.slug}>
              <a href={`/product/${product.slug}`}>
                <img src={product.image} alt={product.image} />
              </a>
              <div className="product-info">
                <a href={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </a>
                <p><strong>{product.price}</strong></p>
                <button>Adicionar ao carrinho</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
