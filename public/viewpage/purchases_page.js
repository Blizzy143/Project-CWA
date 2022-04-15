import { MENU, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import { currentUser } from '../controller/firebase_auth.js';
import { getPurchaseHistory, addproductcomment, getProductList } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { modalTransaction } from './elements.js';
import { product_comment } from '../model/product_comment.js';

export function addEventListeners() {
    MENU.Purchases.addEventListener('click', async () => {
        history.pushState(null, null, ROUTE_PATHNAMES.PURCHASES);
        const label = Util.disableButton(MENU.Purchases);
        await purchases_page();
        Util.enableButton(MENU.Purchases, label);
    });
}

export async function purchases_page() {
    if (!currentUser) {
        root.innerHTML = '<h1> Protected Page</h1>';
        return;
    }

    let html = '<h1>Purchase History</h1>'

    let carts;
    try {
        carts = await getPurchaseHistory(currentUser.uid);
        if (carts.length == 0) {
            html += '<h3>No Purchase History Found!</h3>';
            root.innerHTML = html;
            return;
        }

    } catch (e) {
        if (DEV) console.log(e);
        Util.info('Error in getPurchaseHistory', JSON.stringify(e));
        root.innerHTML = '<h1>Failed to get purchase history</h1>';
        return;
    }

    html += `
    <table class="table">
    <thead>
      <tr>
        <th scope="col">View</th>
        <th scope="col">Items</th>
        <th scope="col">Price</th>
        <th scope="col">Date</th>
      </tr>
    </thead>
    <tbody>
    `;

    for (let i = 0; i < carts.length; i++) {
        html += `
        <tr>
            <td>
                <form method="post" class="form-purchase-details">
                    <input type="hidden" name="index" value="${i}">
                    <button type="submit" class="btn btn-outline-primary">Details</button>
                </form
            </td>
            <td>${carts[i].getTotalQty()}</td>
            <td>${Util.currency(carts[i].getTotalPrice())}</td>
            <td>${new Date(carts[i].timestamp).toString()}</td>
        </tr>
        `;
    }

    html += '</tbody></table>';
    root.innerHTML = html;

    const detailsFrom = document.getElementsByClassName('form-purchase-details');
    for (let i = 0; i < detailsFrom.length; i++) {
        detailsFrom[i].addEventListener('submit', e => {
            e.preventDefault();
            const index = e.target.index.value;
            modalTransaction.title.innerHTML = `Purchased At: ${new Date(carts[index].timestamp).toString()}`;
            buildTransactionView(carts[index]);
            modalTransaction.modal.show();
        })
    }
}

async function buildTransactionView(cart) {
    let html = `
    <table class="table">
    <thead>
      <tr>
        <th scope="col">Image</th>
        <th scope="col">Name</th>
        <th scope="col">Price</th>
        <th scope="col">Qty</th>
        <th scope="col">Sub-Total</th>
        <th scope="col" width="50%">Summary</th>       
        <th scope="col" width="50%">Add Reviews</th>
        <th scope="col" width="50%">Add Rating</th>
      </tr>
    </thead>
    <tbody>
    `;


    cart.items.forEach(p => {
        html += `
            <tr>
                <td><img src="${p.imageURL}"></td>
                <td>${p.name}</td>
                <td>${Util.currency(p.price)}</td>
                <td>${p.qty}</td>
                <td>${Util.currency(p.price * p.qty)}</td>
                <td>${p.summary}</td>
                <td>
                <form method="post" class="modal-review-form">
            <input type="hidden" name="index" value="${p.name}">
            <button type="click" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modal-review">Review</button>
                </form
                </td>
                
                <td>                 
                <form method="post" class="rating">
                    <input type="radio" name="rating" value="5" id="5"><label for="5">☆</label> 
                    <input type="radio" name="rating" value="4" id="4"><label for="4">☆</label> 
                    <input type="radio" name="rating" value="3" id="3"><label for="3">☆</label> 
                    <input type="radio" name="rating" value="2" id="2"><label for="2">☆</label> 
                    <input type="radio" name="rating" value="1" id="1"><label for="1">☆</label>
                </form>                
                </td>
            </tr>
        `;
    });


    html += "</tbody></table>"
    html += `
        <div class="fs-3">Total: ${Util.currency(cart.getTotalPrice())}</div>
    `;
    modalTransaction.body.innerHTML = html;

    const modalreview = document.getElementsByClassName('modal-review-form');
    for (let i = 0; i < modalreview.length; i++) {
        modalreview[i].addEventListener("click", async e => {
            e.preventDefault();
            console.log(modalreview[i].index.value);
            let prod = [];

            let btnval = modalreview[i].index.value;
            prod = await getProductList();
            console.log(prod);
            let productId;
            for (let i = 0; i < prod.length; i++) {
                if (btnval == prod[i].name) {
                    productId = prod[i].docId;
                    break;
                }
            }

            const addreviewbutton = document.getElementById("addbtn");
            addreviewbutton.addEventListener("click", async f => {
                f.preventDefault();

                let test1 = document.forms["form-review"];
                const y = test1.review_text_box.value.toString();

                console.log(y);
                const comment = y;
                const email = currentUser.email;
                const timestamp = Date.now();
                const comments = new product_comment({
                    productId, comment, email, timestamp
                });
                console.log(comments)
                try {
                    const id = await addproductcomment(comments);
                    comments.set_docId(id);
                }
                catch (f) {
                    console.log("error");
                }
            })
        })
    }
    const starrating = document.getElementsByClassName('rating');
    for (let i = 0; i < modalreview.length; i++) {
        starrating[i].addEventListener('click',async e=>{
            e.preventDefault();
            console.log(starrating[i].rating);
        })
    }
}