import * as Elements from './elements.js';

export function currency(value){
    return Intl.NumberFormat('en-US',{style: 'currency', currency: 'USD'}).format(value);
}

export function info(title, body, closeModal) {
    if(closeModal) closeModal.hide();
    Elements.modalInfobox.title.innerHTML = title;
    Elements.modalInfobox.body.innerHTML = body;
    Elements.modalInfobox.modal.show();
}

export function disableButton(button) {
    button.disabled = true;
    const originalLabel = button.innerHTML;
    button.innerHTML='Wait...';
    return originalLabel;
}

export function enableButton(button, label){
    if(label)button.innerHTML=label;
    button.disabled = false;
}

//From Stackoverflow
export function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}