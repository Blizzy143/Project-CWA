import { currentUser } from "../controller/firebase_auth.js";
import { getProductList, getProductWishlist } from "../controller/firestore_controller.js";
import { ROUTE_PATHNAMES } from "../controller/route.js";
import { DEV } from "../model/constants.js";
import { MENU, root } from "./elements.js";
import * as Util from './util.js';

export function addEventListeners() {
    MENU.menuwishlist.addEventListener('click', async () => {
        history.pushState(null, null, ROUTE_PATHNAMES.WISHLIST);
        const label = Util.disableButton(MENU.menuwishlist);
        await productWishList();
        Util.enableButton(MENU.menuwishlist, label);        
    });
}

export async function productWishList(){

        if (!currentUser) {
            root.innerHTML = '<h1> Protected Page</h1>';
            return;
        }
        let html = '<h1>Products WishList</h1>'
        let prod_wish = []
        let products = []
        try {
            prod_wish = await getProductWishlist(currentUser.email);
            products = await getProductList();
            console.log(products);
            if (prod_wish.length == 0) {
                html = '<h1>Empty Wishlist!</h1>';
                root.innerHTML = html;
                return;
            }
        }
        catch (e) 
        {
            if (DEV) console.log(e);            
            Util.info('Failed to get the product Wish list', JSON.stringify(e));
        }
        html = `
                <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Product Image</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Product Price</th>
                    </tr>
                </thead>
                <tbody>
                `;
        for(let j=0;j<products.length;j++)
         {
            for (let i = 0; i < prod_wish.length; i++)
            {
                if(products[j].docId == prod_wish[i].productId)
                {
                    html += `
                    <tr>
                        <td><img src="${products[j].imageURL}"></td>
                        <td>${products[j].name}</td>
                        <td>${products[j].price}</td>
                    </tr>
                    `;
                    break;
                }
            }
        }

        html += '</tbody></table>';
        root.innerHTML = html;
    
}