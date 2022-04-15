import { formSearch, root } from './elements.js';
import { getProductList } from '../controller/firestore_controller.js';
import { cart } from './cart_page.js';
import { DEV } from '../model/constants.js';
import { currentUser } from '../controller/firebase_auth.js';
import * as Util from './util.js';
import { buildHomeScreen } from './home_page.js';

export async function addEventListeners() {
    let products;
    let html='';
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

    formSearch.addEventListener('submit', async e => {
        e.preventDefault();
        let prod1=[];
        let searchKeys = e.target.searchKeys.value.trim();

        if (searchKeys.length == 0) {
            Util.info('Error', 'No Search Keys');
            return;
        }
        
        for (let i = 0; i < products.length; i++) {
            if (products[i].name.indexOf(searchKeys) != -1)
                prod1.push(products[i]);
        }

        console.log(prod1);
        buildHomeScreen(prod1);

    })
}

function buildProductView(product, index) {
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
                        class="container round text-center text-white bg-primary d-inline-block w-50">
                        ${product.qty == null || product.qty == 0 ? 'Add' : product.qty}
                    </div>
                    <button class="btn btn-outline-danger" type="submit"
                        onclick="this.form.submitter='INC'">&plus;</button>
                        <div class="text-center">
                    <button class="btn btn-outline-primary d-inline-block w-44" type="submit"
                        data-bs-toggle="modal" data-bs-target="#modal-all-review" onclick="this.form.submitter='REVIEW'">Reviews</button>
                    
                    <button class="btn btn-outline-primary" type="submit" id="wishlist-pdt-add" 
                        onclick="this.form.submitter='Wishlist'"><span>&hearts;</span></button>    
            </div>
                </form>
            </div>
        </div>
    </div>
    `;
}