import { buttonNameAsc, buttonNameDesc, buttonPriceAsc, buttonPriceDesc, root } from './elements.js';
import { getProductList, getProductListDescending, getProductPriceAscending, getProductPriceDescending } from '../controller/firestore_controller.js';
import { cart } from './cart_page.js';
import { DEV } from '../model/constants.js';
import * as Util from './util.js';
import { buildHomeScreen } from './home_page.js';

export async function addEventListenersProductNameAsc() {
    let products;
    let html = '';
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
    
    buttonNameAsc.addEventListener('click', async e => {
        e.preventDefault();
        console.log('Name Increase');
        buildHomeScreen(products);

    })
}

export async function addEventListenersProductNameDesc() {
    let products;
    let html = '';
    try {
        products = await getProductListDescending();
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

    buttonNameDesc.addEventListener('click', async e => {
        e.preventDefault();
        console.log('Name Decrease');
        buildHomeScreen(products);

    })
}

export async function addEventListenersProductPriceAsc() {
    let products;
    let html = '';
    try {
        products = await getProductPriceAscending();
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

    buttonPriceAsc.addEventListener('click', async e => {
        e.preventDefault();
        console.log('Price Increase');
        buildHomeScreen(products);

    })
}

export async function addEventListenersProductPriceDesc() {
    let products;
    let html = '';
    try {
        products = await getProductPriceDescending();
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

    buttonPriceDesc.addEventListener('click', async e => {
        e.preventDefault();
        console.log('Price Decrease');
        buildHomeScreen(products);

    })
}