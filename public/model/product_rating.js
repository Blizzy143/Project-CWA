export class product_rating {
    constructor(data) { 
           this.productId=data.productId;        
           this.rating=data.rating;
           this.email=data.email;
           this.timestamp=data.timestamp;        
    } 

    set_docId(id) {
        this.docId = id;
    }
    
    toFirestore() {
        return {
            productId:this.productId,
            rating: this.rating,
            email: this.email,
            timestamp: this.timestamp,
        };
    }
}