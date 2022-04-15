import { formSearch, MENU, modalallreview, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import { addproductwishlist, getProductComment, getProductList, paginatedProduct } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { currentUser } from '../controller/firebase_auth.js';
import { cart } from './cart_page.js';
import { product_wishlist } from '../model/product_wishlist.js';

export function addEventListeners() {
    MENU.Home.addEventListener('click', async () => {
        history.pushState(null, null, ROUTE_PATHNAMES.HOME);
        const label = Util.disableButton(MENU.Home);
        await home_page();
        Util.enableButton(MENU.Home, label);
    });
}

export async function home_page() {

    let html = '<h1>Enjoy Shopping</h1>';
    let products, prod1 = [];
    try {
        products = await getProductList();
        if (cart && cart.getTotalQty() != 0) {
            cart.items.forEach(item => {
                const p = products.find(e => e.docId == item.docId)
                if (p) p.qty = item.qty;
            });
        }
    } catch (e) {
        if (DEV) console.log(e);
        Util.info('Failed to get the product list', JSON.stringify(e));
    }

    buildHomeScreen(products);
    let products1 =[]

    /*var x1 = document.querySelector(".btn-page");
    x1.addEventListener('click',e=>{
        e.preventDefault();
        const buttonVal=e.target.id;
        console.log(buttonVal);

        for(let i=buttonVal;i<=buttonVal+2;i++){
            products1.push(products[i]);
        }
        
        
    })
    buildHomeScreen(products1);*/
}

export function buildHomeScreen(products) {
    let html = '';
    for (let i = 0; i < products.length; i++) {
        html += buildProductView(products[i], i)
    }
    console.log(products);
    root.innerHTML = html;

    const productForms = document.getElementsByClassName('form-product-qty');
    for (let i = 0; i < productForms.length; i++) {
        productForms[i].addEventListener('submit', async e => {
            e.preventDefault();
            const p = products[e.target.index.value];
            const submitter = e.target.submitter;
            console.log(submitter)
            if (submitter == 'DEC') {
                cart.removeItem(p);
                if (p.qty > 0) --p.qty;
            } else if (submitter == 'INC') {
                cart.addItem(p);
                p.qty = p.qty == null ? 1 : p.qty + 1;
            }
            else if (submitter == 'REVIEW') {
                let html;
                const productId = p.docId;
                let prod_com = []
                try {
                    prod_com = await getProductComment(productId);
                    if (prod_com.length == 0) {
                        html = '<h5>No Reviews Found!</h5>';
                        modalallreview.body.innerHTML = html;
                        return;
                    }
                }
                catch (e) {
                    if (DEV) console.log(e);
                    Util.info('Failed to get the product comment list', JSON.stringify(e));
                }
                html = `
                <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Review</th>
                        <th scope="col">Commented At</th>
                    </tr>
                </thead>
                <tbody>
                `;

                for (let i = 0; i < prod_com.length; i++) {
                    html += `
                    <tr>
                        <td>${prod_com[i].email}</td>
                        <td>${prod_com[i].comment}</td>
                        <td>${new Date(prod_com[i].timestamp).toString()}</td>
                    </tr>
                    `;
                }

                html += '</tbody></table>';
                modalallreview.body.innerHTML = html;

            }
            else {
                const productId = p.docId;
                const wishlist = document.getElementById('wishlist-pdt-add');
                const email = currentUser.email;
                const prod_wish = new product_wishlist({
                    productId, email
                });
                try {
                    const id = await addproductwishlist(prod_wish);
                    prod_wish.set_docId(id);
                }
                catch (e) {
                    if (DEV) console.log(e);
                    Util.info('Failed to add the product to Wish list', JSON.stringify(e));
                }
            }

            const updateQty = (p.qty == null || p.qty == 0) ? 'Add' : p.qty;
            document.getElementById(`item-count-${p.docId}`).innerHTML = updateQty;
            MENU.CartItemCount.innerHTML = `${cart.getTotalQty()}`;

        })
    }
}

export function buildProductView(product, index) {
    return `
    <div id="card-${product.docId}" class="card d-inline-flex" style="width: 18rem; display: inline-block;">
        <img src="${product.imageURL}" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">
            ${Util.currency(product.price)}<br>
            ${product.summary}</p>

            <div class="container pt-3 bg-light ${currentUser ? 'd-block' : 'd-none'}">
                <form method="post" class="form-product-qty">
                    <input type="hidden" name="index" value="${index}">
                    <button class="btn btn-outline-danger" type="submit"
                        onclick="this.form.submitter='DEC'">&minus;</button>
                    <div id="item-count-${product.docId}"
                        class="container round text-center text-white bg-success d-inline-block w-50">
                        ${product.qty == null || product.qty == 0 ? 'Add' : product.qty}
                    </div>
                    <button class="btn btn-outline-danger" type="submit"
                        onclick="this.form.submitter='INC'">&plus;</button>
                        <div class="text-center">
                    <button class="btn btn-outline-success d-inline-block w-44" type="submit"
                        data-bs-toggle="modal" data-bs-target="#modal-all-review" onclick="this.form.submitter='REVIEW'">Reviews</button>                    
                        <button class="btn btn-outline-danger" type="submit" id="wishlist-pdt-add" 
                        data-bs-toggle="modal" data-bs-target="#modal-pdt-wish" onclick="this.form.submitter='Wishlist'"><span>&hearts;</span></button> 
                       
            </div>
                </form>
            </div>
        </div>
    </div>
    `;
}