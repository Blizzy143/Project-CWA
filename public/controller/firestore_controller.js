import {
    getFirestore,
    query,
    collection,
    orderBy,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    where,
    doc,
    updateDoc,
    startAfter,
    limit,
    deleteDoc,
}
    from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { AccountInfo } from "../model/account_info.js";
import { product_comment } from "../model/product_comment.js";
import { COLLECTION_NAMES } from "../model/constants.js";
import { Product } from "../model/product.js";
import { ShoppingCart } from "../model/shopping_cart.js";
import { product_wishlist } from "../model/product_wishlist.js";
import { product_rating } from "../model/product_rating.js";
const db = getFirestore();

export async function getProductList() {
    const products = [];
    const q = query(collection(db, COLLECTION_NAMES.PRODUCT), orderBy('name'));
    const snapShot = await getDocs(q);

    snapShot.forEach(doc => {
        const p = new Product(doc.data());
        p.set_docId(doc.id);
        products.push(p);
    });
    return products;
}

export async function getallProductComment() {
    const productcomments = [];
    const q = query(collection(db, COLLECTION_NAMES.PRODUCT_COMMENTS));
    const snapShot = await getDocs(q);

    snapShot.forEach(doc => {
        const p = new product_comment(doc.data());
        p.set_docId(doc.id);
        productcomments.push(p);
    });
    return productcomments;
}

export async function getProductComment(productId) {
    const pc = [];
    const docRef = query(collection(db, COLLECTION_NAMES.PRODUCT_COMMENTS), where('productId', '==', productId), orderBy('timestamp'));
    const docSnap = await getDocs(docRef);

    docSnap.forEach(doc => {
        const p = new product_comment(doc.data());
        p.set_docId(p);
        pc.push(p);
    });
    return pc;
}

export async function deleteProductComment(prodCommId){
    const docRef = doc(db, COLLECTION_NAMES.PRODUCT_COMMENTS, prodCommId);
    await deleteDoc(docRef);
}

export async function updateProductComment(prodCommId,newCom){
    const docRef = doc(db, COLLECTION_NAMES.PRODUCT_COMMENTS, prodCommId);
    await updateDoc(docRef,{
        comment: newCom
    })
}

export async function getProductRating(productId) {
    const pr = [];
    const docRef = query(collection(db, COLLECTION_NAMES.PRODUCT_RATING), where('productId', '==', productId), orderBy('timestamp'));
    const docSnap = await getDocs(docRef);

    docSnap.forEach(doc => {
        const p = new product_rating(doc.data());
        p.set_docId(p);
        pr.push(p);
    });
    return pr;
}


export async function checkout(cart) {
    const data = cart.serialize(Date.now());
    await addDoc(collection(db, COLLECTION_NAMES.PURCHASE_HISTORY), data);
}

export async function getPurchaseHistory(uid) {
    const q = query(collection(db, COLLECTION_NAMES.PURCHASE_HISTORY),
        where('uid', '==', uid),
        orderBy('timestamp', 'desc'));
    const snapShot = await getDocs(q);

    const carts = [];
    snapShot.forEach(doc => {
        const sc = ShoppingCart.deserialize(doc.data());
        carts.push(sc);
    });
    return carts;
}

export async function getAccountInfo(uid) {
    const docRef = doc(db, COLLECTION_NAMES.ACCOUNT_INFO, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return new AccountInfo(docSnap.data());
    }
    else {
        const defaultInfo = AccountInfo.instance();
        const accountDocRef = doc(db, COLLECTION_NAMES.ACCOUNT_INFO, uid);
        await setDoc(accountDocRef, defaultInfo.serialize());
        return defaultInfo;
    }
}

export async function updateAccountInfo(uid, updateInfo) {
    // updateInfo = {key: value}
    const docRef = doc(db, COLLECTION_NAMES.ACCOUNT_INFO, uid);
    await updateDoc(docRef, updateInfo);
}
export async function addproductcomment(comment) {
    const docRef = await addDoc(collection(db, COLLECTION_NAMES.PRODUCT_COMMENTS), comment.toFirestore());
    return docRef.id;
}

export async function addproductrating(rating) {
    const docRef = await addDoc(collection(db, COLLECTION_NAMES.PRODUCT_RATING), rating.toFirestore());
    return docRef.id;
}

export async function addproductwishlist(product) {
    const docRef = await addDoc(collection(db, COLLECTION_NAMES.PRODUCT_WISHLIST), product.toFirestore());
    return docRef.id;
}

export async function getProductWishlist(email) {
    const pw = [];
    const docRef = query(collection(db, COLLECTION_NAMES.PRODUCT_WISHLIST), where('email', '==', email));
    const docSnap = await getDocs(docRef);

    docSnap.forEach(doc => {
        const p = new product_wishlist(doc.data());
        p.set_docId(p);
        pw.push(p);
    });
    return pw;
}

export async function getProductListDescending() {
    const products = [];
    const q = query(collection(db, COLLECTION_NAMES.PRODUCT), orderBy('name', 'desc'));
    const snapShot = await getDocs(q);

    snapShot.forEach(doc => {
        const p = new Product(doc.data());
        p.set_docId(doc.id);
        products.push(p);
    });
    return products;
}

export async function getProductPriceAscending() {
    const products = [];
    const q = query(collection(db, COLLECTION_NAMES.PRODUCT), orderBy('price'));
    const snapShot = await getDocs(q);

    snapShot.forEach(doc => {
        const p = new Product(doc.data());
        p.set_docId(doc.id);
        products.push(p);
    });
    return products;
}

export async function getProductPriceDescending() {
    const products = [];
    const q = query(collection(db, COLLECTION_NAMES.PRODUCT), orderBy('price', 'desc'));
    const snapShot = await getDocs(q);

    snapShot.forEach(doc => {
        const p = new Product(doc.data());
        p.set_docId(doc.id);
        products.push(p);
    });
    return products;
}