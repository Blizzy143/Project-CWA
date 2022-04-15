export class product_comment {
    constructor(data) { 
           this.productId=data.productId;        
           this.comment=data.comment;
           this.email=data.email;
           this.timestamp=data.timestamp;        
    } 

    set_docId(id) {
        this.docId = id;
    }
    
    //toFirestore data, format, etc
    toFirestore() {
        return {
            productId:this.productId,
            comment: this.comment,
            email: this.email,
            timestamp: this.timestamp,
        };
    }
}