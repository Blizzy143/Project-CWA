import { MENU, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import { ShoppingCart } from '../model/shopping_cart.js';
import { currentUser } from '../controller/firebase_auth.js';
import { currency,disableButton,enableButton, info } from './util.js';
import { home_page } from './home_page.js';
import { DEV } from '../model/constants.js';
import { checkout } from '../controller/firestore_controller.js';
export function addEventListeners() {
    MENU.Cart.addEventListener('click', async () => {
        history.pushState(null, null, ROUTE_PATHNAMES.CART);
        await cart_page();

    });
}
export let cart;

export async function cart_page() {
    if (!currentUser) {
        root.innerHTML = '<h1>Protected Page</h1>';
        return;
    }

    let html = '<h1>Shopping Cart</h1>'
    if (!cart || cart.getTotalQty() == 0) {
        html += '<h3>Empty! Buy More!</h3>';
        root.innerHTML = html;
        return;
    }

    html = `
    <table class="table">
    <thead>
      <tr>
        <th scope="col">Image</th>
        <th scope="col">Name</th>
        <th scope="col">Unit Price</th>
        <th scope="col">Quantity</th>
        <th scope="col">Sub-Total</th>
        <th scope="col" width="50%">Summary</th>
      </tr>
    </thead>
    <tbody>
    `;

    cart.items.forEach(item => {
        html+=`
        <tr>
            <td><img src="${item.imageURL}" width="150px"</td>
            <td>${item.name}</td>
            <td>${currency(item.price)}</td>
            <td>${item.qty}</td>
            <td>${currency(item.price * item.qty)}</td>
            <td>${item.summary}</td>
        </tr>
        `;
    });

    html += '</tbody></table>';
    html += `
    <div class="fs-3"> TOTAL: ${currency(cart.getTotalPrice())}</div>
    `;
    html+=`
    <button id="button-checkout" class="btn btn-outline-primary">Check Out</button>
    <button id="button-continue-shopping" class="btn btn-outline-secondary">Continue Shopping</button>
    `;
    root.innerHTML = html;

    const continueButton = document.getElementById('button-continue-shopping');
    continueButton.addEventListener('click',async() => {
        history.pushState(null,null,ROUTE_PATHNAMES.HOME);
        const label = disableButton(continueButton);
        await home_page();
        enableButton(continueButton,label);
    })

    const checkoutButton = document.getElementById('button-checkout');
    checkoutButton.addEventListener('click',async()=>{
        const label = disableButton(checkoutButton);
        try{
            await checkout(cart);
            info('Success!','Checkout Complete!');
            cart.clear();
            MENU.CartItemCount.innerHTML = 0;
            history.pushState(null,null,ROUTE_PATHNAMES.HOME);
            await home_page();
        } catch(e){
            if(DEV) console.log(e);
            info('Checkout Failed', JSON.stringify(e));
        }
        enableButton(checkoutButton,label);
    });
}

export function initShoppingCart() {
    cart = new ShoppingCart(currentUser.uid);
    MENU.CartItemCount.innerHTML = 0;
}