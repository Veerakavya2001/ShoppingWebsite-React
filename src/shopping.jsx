import React from "react";
import { useState, useEffect } from "react";

function Shopping() {
  const [categories, setcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [CartItems, setCartItems] = useState([]);
  const [itemsCount, setItemsCount] = useState(0);
  const [warning, setwarning] = useState(false);
  const [price, setprice] = useState(0);
  let [show,setshow]=useState(true);

  function GetCartItemsCount() {
    setItemsCount(CartItems.length);
  }

  function LoadCategories() {
    fetch("http://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((data) => {
        data.unshift("all");
        setcategories(data);
      });
  }
  function LoadProducts(url) {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  }
  useEffect(() => {
    LoadCategories();
    LoadProducts("http://fakestoreapi.com/products");
  }, []);

  useEffect(() => {
    GetCartItemsCount();
    findTotal();
  });

  function handleCategoryChange(e) {
    if (e.target.value === "ALL") {
      LoadProducts("http://fakestoreapi.com/products");
    } else {
      LoadProducts(
        `http://fakestoreapi.com/products/Category/${e.target.value.toLowerCase()}`
      );
    }
  }

  function handleAddtoCart(item) {
    let isPresent = false;
    CartItems.forEach((product) => {
      if (item.id === product.id) {
        isPresent = true;
      }
    });
    if (isPresent) {
      setwarning(true);
      setTimeout(() => {
        setwarning(false);
      }, 2000);
      return;
    }

    const newItem = { ...item, amount: 1 }; // Add the 'amount' property with an initial value of 1
    setCartItems([...CartItems, newItem]);
  }

  function handledeleteCartItem(ind) {
    const updatededCartItems = CartItems.filter((_, index) => index !== ind);
    setCartItems(updatededCartItems);
  }
  const handleremoveAll = () => {
    setCartItems([]);
  };
  const findTotal = () => {
    let ans = 0;
    CartItems.map((item) => (ans += item.amount * item.price));
    setprice(ans.toFixed(2));
  };
  const handleChange = (item, change) => {
    const updatedCartItems = CartItems.map((cartItem) => {
      if (cartItem.id === item.id) {
        const newAmount = cartItem.amount + change;
        if (newAmount >= 1) {
          return { ...cartItem, amount: newAmount };
        }
      }
      return cartItem;
    });
    setCartItems(updatedCartItems);
  };


  return (
    <div className="container-fluid">
      <header className="bg-danger text-white text-center p-2 d-flex justify-content-sm-between p-20">
        <h1 onClick={()=>setshow(true)} className="pe-auto">Shopping Home</h1>
        <nav className="text-center p-2 d-flex ">
          
            <div className="mx-3">
              <select onChange={handleCategoryChange} className="form-select">
                {categories.map((item) => (
                  <option key={item}>{item.toUpperCase()}</option>
                ))}
              </select>
            </div>
          
          <div className="position-relative">
            <span className="bi bi-cart h2 " onClick={()=>setshow(false)}>
            </span>  
            <span className="position-absolute top-10  translate-middle badge rounded-pill bg-secondary ">{itemsCount}</span>
          </div>
        </nav>
      </header>
{
  show? <main
  className="d-flex flex-wrap overflow-auto pb-5"
  style={{ height: "90vh" }}
>
  {products.map((product) => (
    <div
      className="card m-4 p-2 "
      key={product.id}
      style={{ width: "200px" }}
    >
      <img
        src={product.image}
        className="card-img-top"
        height="130"
        alt={product.title}
      ></img>
      <div className="card-header" style={{ height: "160px" }}>
        <p>{product.title}</p>
      </div>
      <div className="card-body">
        <dl>
          <dt>Price</dt>
          <dd>{product.price}</dd>
          <dt>Rating</dt>
          <dd>
            <span className="bi bi-star-fill text-success"></span>
            {product.rating.rate}
            <span>[{product.rating.count}]</span>
          </dd>
        </dl>
      </div>
      <div className="card-footer">
        <button
          id={product.id}
          onClick={() => handleAddtoCart(product)}
          className="btn btn-danger w-100"
        >
          <span className="bi bi-cart4"></span> Add to Cart
        </button>
      </div>
    </div>
  ))}
</main>: <div>
  {
    itemsCount?<div className="overflow-auto pb-5 " style={{ height: "80vh" }}>
    <div className="text-center h1">
          Your Cart Items
    </div>
    <table className="table table-hover m-auto" style={{ width: "70vw" }}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Preview</th>
          <th>Quantity</th>
          
        </tr>
      
      </thead>
      <tbody>
        {CartItems.map((item, index) => (
          <tr key={item.id}>
            <td >{item.title}</td>
            <td>{item.price}</td>
            <td>
              <img
                src={item.image}
                width="50"
                height="50"
                alt={item.title}
              />
            </td>
            <td className="amount_btns">
              <button onClick={() => handleChange(item, +1)}>+</button>
              <button>{item.amount}</button>
              <button onClick={() => handleChange(item, -1)}>-</button>
            </td>
            <td>
              <button
                className="btn btn-danger"
                onClick={() => handledeleteCartItem(index)}
              >
                <span className="bi bi-trash"></span>
              </button>
            </td>
          </tr>
          
        ))}
       
      </tbody>
      
    </table>
    <div className="d-flex justify-content-evenly align-items-center">
      <div className=" h2 mt-3 ms-4">
      <span>Total Price Of your Cart</span>
      <span className="ms-4">Rs-{price}</span>
    </div>
    <button className="btn btn-danger pt-0 ms-9" onClick={handleremoveAll}>
          Clear All
    </button>
      </div>
    
        
  </div>:<div className=" d-flex  justify-content-center align-items-center h1 bg-secondary" style={{height: "90vh" }}>No Cart Items Added</div>
  }
</div>
}
      

      {warning && (
          <div className="warning"> Item is already added to your Cart</div>
        )}
    </div>
  );
}

export default Shopping;
 
        