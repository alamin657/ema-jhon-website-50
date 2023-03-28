import React, { useEffect, useState } from 'react';
import { addToDb, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    useEffect(() => {
        fetch('products.json')
            .then(res => res.json())
            .then(data => setProducts(data))

    }, [])
    useEffect(() => {
        const storeCart = getShoppingCart();
        const savedCart = [];
        // step:1 get id of the addedProduct
        for (const id in storeCart) {
            // step:2 get  product from products state using by id
            const addedProduct = products.find(product => product.id === id)
            // step-3: get quantity of the product
            if (addedProduct) {
                const quantity = storeCart[id];
                addedProduct.quantity = quantity;
                // step-4: add the addedProduct to savedCart
                savedCart.push(addedProduct);
            }
            // console.log(addedProduct);
        }
        // step-5: set the cart
        setCart(savedCart);
    }, [products])
    const handleAddToCart = (product) => {
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        // advanced
        const exists = cart.find(pd => pd.id === product.id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product];
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remainging = cart.filter(pd => pd.id !== product.id);
            newCart = [...remainging, exists];
        }
        setCart(newCart);
        addToDb(product.id);

    }
    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product.id}
                        handleAddToCart={handleAddToCart}
                        product={product}>
                    </Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}></Cart>
            </div>
        </div>
    );
};

export default Shop;