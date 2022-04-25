import { MENU, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import { currentUser } from '../controller/firebase_auth.js';
import { getPurchaseHistory, addproductcomment, getProductList, addproductrating, getallProductComment, deleteProductComment, updateProductComment } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { modalTransaction } from './elements.js';
import { product_comment } from '../model/product_comment.js';
import { product_rating } from '../model/product_rating.js';

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
        <th scope="col" width="50%">Delete Reviews</th>
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
                    <form method="post" class="modal-delete-review-form">
                        <input type="hidden" name="index" value="${p.name}">
                        <button type="click" class="btn btn-danger-outline" 
                        data-bs-toggle="modal" data-bs-target="#modal-delete-review">Delete Review</button>
                    </form>       
                </td>

                <td> 
                    <form method="post" class="modal-update-review-form">
                        <input type="hidden" name="index" value="${p.name}">
                        <button type="click" class="btn btn-danger-outline" 
                        data-bs-toggle="modal" data-bs-target="#modal-update-review">Update Review</button>
                    </form>       
                </td>
                
                <td>                 
                <form method="post" class="rating">
                <div class="padding">
                    <div class="col-md-6">
                    <div class="box box-blue box-example-square">
                        <div class="box-header">Square Rating</div>
                        <div class="box-body"> <select id="example-square" name="rating" autocomplete="off">
                                <option value="0"></option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select> </div>
                            </div>
                        </div>
                    </div>
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
            let prod = [];

            let btnval = modalreview[i].index.value;
            prod = await getProductList();
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

    const deletereview = document.getElementsByClassName("modal-delete-review-form");
    for (let i = 0; i < deletereview.length; i++) {
        deletereview[i].addEventListener("click", async e => {
            e.preventDefault();
            console.log(deletereview[i].index.value);
            const btnval = deletereview[i].index.value;
            let prod = [];
            prod = await getProductList();
            let productId;
            for (let i = 0; i < prod.length; i++) {
                if (btnval == prod[i].name) {
                    productId = prod[i].docId;
                    break;
                }
            }
            console.log(productId);

            let prod_comm = [];
            prod_comm = await getallProductComment();
            let prodcommind = -1;
            for(let i = 0;i<prod_comm.length; i++){
                if(prod_comm[i].email==currentUser.email && prod_comm[i].productId==productId)
                {
                    prodcommind=i;
                    break;
                }
            }
            if(prodcommind!=-1)
            {    console.log(prod_comm[prodcommind]);
                console.log(prod_comm[prodcommind].docId);}
            else
                console.log(prodcommind);




            const deletebuttonconfirm = document.getElementById('delete-review-final-button');
            deletebuttonconfirm.addEventListener("click",async f=>{
                f.preventDefault();
                if(prodcommind!=-1)
                {
                    try{
                        await deleteProductComment(prod_comm[prodcommind].docId);
                        Util.info('Success', 'Delete Successful');
                    }
                    catch(f){
                        console.log("Error");
                        if (Constants.DEV) console.log("Delete Error :" + f);
                        Util.info('Error', JSON.stringify(f));
                        return;
                    }
                }
                

            })
        })
    }

    const updatereview = document.getElementsByClassName("modal-update-review-form");
    for (let i = 0; i < updatereview.length; i++) {
        updatereview[i].addEventListener("click", async e => {
            e.preventDefault();
            console.log(updatereview[i].index.value);
            const btnval = updatereview[i].index.value;
            let prod = [];
            prod = await getProductList();
            let productId;
            for (let i = 0; i < prod.length; i++) {
                if (btnval == prod[i].name) {
                    productId = prod[i].docId;
                    break;
                }
            }
            console.log(productId);

            let prod_comm = [];
            prod_comm = await getallProductComment();
            let prodcommind = -1;
            for(let i = 0;i<prod_comm.length; i++){
                if(prod_comm[i].email==currentUser.email && prod_comm[i].productId==productId)
                {
                    prodcommind=i;
                    break;
                }
            }


            if(prodcommind!=-1)
            {    console.log(prod_comm[prodcommind]);
                console.log(prod_comm[prodcommind].docId);}
            else
                console.log(prodcommind);
            console.log(prodcommind);
            
            let ur = document.forms["form-update-review"];
            ur.update_review_text_box.value = prod_comm[prodcommind].comment ;

            const updatebuttonconfirm = document.getElementById('updatebtn');
            updatebuttonconfirm.addEventListener("click",async f=>{
                let ur1 = document.forms["form-update-review"]
                const new_comment = ur1.update_review_text_box.value
                f.preventDefault();
                if(prodcommind!=-1)
                {
                    try{
                        await updateProductComment(prod_comm[prodcommind].docId,new_comment);
                        Util.info('Success', 'Update Successful');
                    }
                    catch(f){
                        console.log("Error");
                        if (DEV) console.log("Update Error :" + f);
                        Util.info('Error', JSON.stringify(f));
                        return;
                    }
                }
                

            })
        })
    }



    const starrating = document.getElementsByClassName('box-body');
    console.log("Rating Length",starrating[1]);
    for (let i = 0; i < starrating.length; i++) {
        starrating[i].addEventListener('click', async e => {
            e.preventDefault();

            let prod = [];
                let btnval = modalreview[i].index.value;
                prod = await getProductList();
                let productId;
                for (let i = 0; i < prod.length; i++) {
                    if (btnval == prod[i].name) {
                        productId = prod[i].docId;
                        break;
                    }
                }

                console.log(e.target.value);
                const rating = parseInt(e.target.value);
                const email = currentUser.email;
                const timestamp = Date.now();
                const ratings = new product_rating({
                    productId, rating, email, timestamp
                });

                try {
                    const id = await addproductrating(ratings);
                    ratings.set_docId(id);
                }
                catch (e) {
                    console.log("error");
                }
            //})


        })
    }
}