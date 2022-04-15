//main root element
export const root = document.getElementById('root');

export const MENU = {
    SignIn : document.getElementById('menu-signin'),
    Home : document.getElementById('menu-home'),
    Purchases : document.getElementById('menu-purchases'),
    SignOut : document.getElementById('menu-signout'),
    Cart: document.getElementById('menu-cart'),
    Profile: document.getElementById('menu-profile'),
    CartItemCount: document.getElementById('menu-cart-item-count'),
    menuwishlist : document.getElementById('menu-wishlist'),
}



export const formSearch = document.getElementById('form-search');
export const buttonNameAsc = document.getElementById('dropdown-item-name-increasing');
export const buttonNameDesc = document.getElementById('dropdown-item-name-decreasing');
export const buttonPriceAsc = document.getElementById('dropdown-item-price-increasing');
export const buttonPriceDesc = document.getElementById('dropdown-item-price-decreasing');

export const modalInfobox = {
    modal:new bootstrap.Modal(document.getElementById('modal-infobox'), {backdrop: 'static'}),
    title:document.getElementById('modal-infobox-title'),
    body:document.getElementById('modal-infobox-body'),
}

export const modalTransaction ={
    modal: new bootstrap.Modal(document.getElementById('modal-transaction'),{backdrop:'static'}),
    title: document.getElementById('modal-transaction-title'),
    body: document.getElementById('modal-transaction-body')
}

export const modalSignin = {
    modal:new bootstrap.Modal(document.getElementById('modal-signin'),{backdrop:'static'}),
    form: document.getElementById('form-signin'),
    showSignupModal: document.getElementById('button-show-signup-modal'),
}

export const modalSignup = {
    modal:new bootstrap.Modal(document.getElementById('modal-signup'),{backdrop:'static'}),
    form: document.getElementById('modal-signup-form'),
}
export const modalreview ={
    modal: new bootstrap.Modal(document.getElementById('modal-review'),{backdrop:'static'}),
    title: document.getElementById('modal-review-title'),
    body: document.getElementById('modal-review-body')
}

export const modalallreview ={
    modal: new bootstrap.Modal(document.getElementById('modal-all-review'),{backdrop:'static'}),
    title: document.getElementById('modal-all-review-title'),
    body: document.getElementById('modal-all-review-body')
}

export const modalwishlist ={
    modal: new bootstrap.Modal(document.getElementById('modal-pdt-wish'),{backdrop:'static'}),
    title: document.getElementById('modal-pdt-wish'),
    body: document.getElementById('modal-pdt-wish-body')
}