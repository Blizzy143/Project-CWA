export class AccountInfo{
    constructor(data){
        this.name = data.name;
        this.address = data.address;
        this.city = data.city;
        this.state = data.state;
        this.zip = data.zip;
        this.creditNo = data.creditNo;
        this.photoURL = data.photoURL;
    }

    serialize() {
        return {
            name: this.name,
            address:this.address,
            city:this.city,
            state:this.state,
            zip:this.zip,
            creditNo:this.creditNo ,
            photoURL:this.photoURL, 
        }
    }

    static instance() {
        return new AccountInfo({
            name:'',address:'',city:'',
            state:'',zip:'',creditNo:'',
            photoURL:'images/default_profile.png',
        });
    }
}