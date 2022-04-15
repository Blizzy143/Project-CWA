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
    /*const productForms = document.getElementsByClassName('form-product-qty');
    for (let i = 0; i < productForms.length; i++) {
        productForms[i].addEventListener('submit',async e => {
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
            else if(submitter == 'REVIEW'){
                let html;
                const productId = p.docId;
                let prod_com = []
                try{
                    prod_com = await getProductComment(productId);
                    if (prod_com.length == 0) 
                    {
                        html = '<h5>No Reviews Found!</h5>';
                        modalallreview.body.innerHTML = html;
                        return;
                    }
                }
                catch(e){
                    if (DEV) console.log(e);
                    Util.info('Failed to get the product comment list', JSON.stringify(e));
                }                
                html = `
                <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Review</th>
                    </tr>
                </thead>
                <tbody>
                `;

                for (let i = 0; i < prod_com.length; i++) {
                    html += `
                    <tr>
                        <td>${prod_com[i].email}</td>
                        <td>${prod_com[i].comment}</td>
                    </tr>
                    `;
                }
            
                html += '</tbody></table>';
                modalallreview.body.innerHTML = html;           

            }
            else{
                const productId = p.docId;
                const wishlist=document.getElementById('wishlist-pdt-add');
                console.log(wishlist);
                const email = currentUser.email;
                const prod_wish = new product_wishlist({
                    productId,email
                    });
                try{
                    const id = await addproductwishlist(prod_wish);
                    prod_wish.set_docId(id);
                }
                catch(e){
                    if (DEV) console.log(e);
                    Util.info('Failed to add the product to Wish list', JSON.stringify(e));
                }
            }

            const updateQty = (p.qty == null || p.qty == 0) ? 'Add' : p.qty;
            document.getElementById(`item-count-${p.docId}`).innerHTML = updateQty;
            MENU.CartItemCount.innerHTML = `${cart.getTotalQty()}`;
            
        })
    }*/    
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