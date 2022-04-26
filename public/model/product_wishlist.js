export class product_wishlist {
    constructor(data) { 
           this.productId=data.productId;           
           this.email=data.email;                   
    } 

    set_docId(id) {
        this.docId = id;
    }
    
    toFirestore() {
        return {
            productId:this.productId,
            email: this.email,
        };
    }
}