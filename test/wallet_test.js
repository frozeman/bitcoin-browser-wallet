

// SHOW SETUP
describe("showSetup()", function() {
    var jq = $,
        orgCStore = _.clone(cStore);

    beforeEach(function(){

        

    });
    afterEach(function(){
        $ = jq;
        cStore = orgCStore;
    });
    it("should generate and encrypt private and public key", function() {

        $ = function(){
            return {
                find: function(selector){
                    if(selector === 'button.create')
                        return {
                            on: function(event, callback){
                                if(event === 'click')
                                    callback();
                            }
                        };
                    else if(selector === '.password')
                        return {
                            val: function(){
                                // password test
                                return 'test';
                            }
                        }
                    else if(selector === '.passwordConfirm')
                        return {
                            val: function(){
                                return 'test';
                            }
                        }
                    else
                        return {
                            on: function(){}
                        }
                },
                show: function(){}
            }
        };



        cStore = {
            set: function(data){
                // decrypt using the pasword "test"
                expect(CryptoJS.AES.decrypt(data.privateKey, 'test').toString(CryptoJS.enc.Utf8)).toEqual(jasmine.any(String));
                expect(validateAddress(data.publicKey)).toBe(true);
            }
        };

        showSetup();
    });
    it("should import and encrypt private and public key", function() {

        $ = function(){
            return {
                val: function(){ return true; },
                find: function(selector){
                    if(selector === 'button.create')
                        return {
                            on: function(event, callback){
                                if(event === 'click')
                                    callback();
                            }
                        };
                    else if(selector === '.password')
                        return {
                            val: function(){
                                // password test
                                return 'test';
                            }
                        }
                    else if(selector === '.passwordConfirm')
                        return {
                            val: function(){
                                return 'test';
                            }
                        }
                    else if(selector === 'input.importPrivRadio')
                        return {
                            on: function(event, callback){
                                callback();
                            }
                        }
                    else if(selector === 'input.importPrivkey')
                        return {
                            val: function(){
                                return '5HwD9MNQq5LQe3PfinPFEgKNdZ9EciFRQ27bgexCFgE3UqVsJSR';
                            },
                            show: function(){}
                        }
                    else
                        return {
                            on: function(){}
                        }
                },
                show: function(){}
            }
        };



        cStore = {
            set: function(data){
                // decrypt using the pasword "test"
                expect(CryptoJS.AES.decrypt(data.privateKey, 'test').toString(CryptoJS.enc.Utf8)).toEqual('5HwD9MNQq5LQe3PfinPFEgKNdZ9EciFRQ27bgexCFgE3UqVsJSR');
                expect(validateAddress(data.publicKey)).toBe(true);
            }
        };

        showSetup();
    });
}); 



// WALLET
describe("showWallet()", function() {
    var jq = $,
        orgCStore = _.clone(cStore);

    beforeEach(function(){

        

    });
    afterEach(function(){
        $ = jq;
        cStore = orgCStore;
    });
    it("should generate and encrypt private and public key", function() {

        showWallet();

    });
});



// WALLET
describe("XXXshowWallet()", function() {
    var jq = $,
        orgCStore = _.clone(cStore);

    beforeEach(function(){

        

    });
    afterEach(function(){
        $ = jq;
        cStore = orgCStore;
    });
    it("should generate and encrypt private and public key", function() {

        showWallet();

    });
});