export class Product {
    constructor(data) {
        if (data) {
            this.name = data.name.toLowerCase().trim();
            this.price = typeof data.price == 'number' ? data.price : Number(data.price);
            this.summary = data.summary.trim();
            this.imageName = data.imageName;
            this.imageURL = data.imageURL;
            this.qty = Number.isInteger(data.qty) ? data.qty : null;
        }
    }

    clone(){
        const copyData = this.serialize();
        const p = new Product(copyData);
        p.set_docId(this.docId);
        return p;
    }

    set_docId(id) {
        this.docId = id;
    }
    
    //toFirestore data, format, etc
    serialize() {
        return {
            name: this.name,
            price: this.price,
            summary: this.summary,
            imageName: this.imageName,
            imageURL: this.imageURL,
            qty: this.qty,
        }
    }
}