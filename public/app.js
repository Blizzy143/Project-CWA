import * as FirebaseAuth from './controller/firebase_auth.js'
import * as HomePage from './viewpage/home_page.js';
import * as PurchasesPage from './viewpage/purchases_page.js';
import * as CartPage from './viewpage/cart_page.js';
import * as ProfilePage from './viewpage/profile_page.js';
import * as WishlistPage from './viewpage/wishlist_page.js';
import * as SearchPage from './viewpage/search_page.js';
import * as SortPage from './viewpage/sort_page.js';
import {routing} from './controller/route.js';


FirebaseAuth.addEventListeners();
HomePage.addEventListeners();
PurchasesPage.addEventListeners();
CartPage.addEventListeners();
ProfilePage.addEventListeners();
WishlistPage.addEventListeners();
SearchPage.addEventListeners();
SortPage.addEventListenersProductNameAsc();
SortPage.addEventListenersProductNameDesc();
SortPage.addEventListenersProductPriceAsc();
SortPage.addEventListenersProductPriceDesc();



window.onload = () => {
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    routing(pathname,hash);
};

window.addEventListener('popstate', e=> {
    e.preventDefault(); // no refreshing
    const pathname = e.target.location.pathname;
    const hash = e.target.location.hash;
    routing(pathname,hash);
});