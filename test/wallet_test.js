

// SHOW SETUP
describe("showSetup()", function() {
    var jq = jQueryStub,
        orgCStore = _.clone(cStore);

    beforeEach(function(){

        

    });
    afterEach(function(){
        jQueryStub = jq;
        cStore = orgCStore;
    });
    it("should generate and encrypt private and public key", function() {

        // customize stubs
        var find = $().find();
        jQueryStub.prototype.find = function(selector){
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
                return find;
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

        // customize stubs
        var find = $().find();
        jQueryStub.prototype.val = function(){ return true; },
        jQueryStub.prototype.find = function(selector){
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
                return find;
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


// SEND TRANSACTION
describe("showWallet()", function() {
    var jq = jQueryStub,
        orgCStore = _.clone(cStore),
        orgshowSendConfirm = showSendConfirm;

    beforeEach(function(){



        showWallet();

    });
    afterEach(function(){
        jQueryStub = jq;
        cStore = orgCStore;
        showSendConfirm = orgshowSendConfirm;
    });
    it("should show the sendConfirm screen when the send button is pressed", function() {

        // customize stubs
        jQueryStub.prototype.val = function(selector){
            if(selector === '.btcAddress')
                return '17gH3YynN34VVRhwwrnEjfc31LnpP7rcTm';
            if(selector === '.sendAmount')
                return 0.1;
            else
                return find;
        };


        // test
        showSendConfirm = function(){

            // make sure showSendConfirm() was called
            expect(true).toBe(true);
        };

        // run test
        $('#wallet button.send').trigger('click');


    });
});



// SEND MONEY
describe("showSendConfirm()", function() {
    var jq = jQueryStub,
        orgCStore = _.clone(cStore);

    beforeEach(function(){

        

    });
    afterEach(function(){
        jQueryStub = jq;
        cStore = orgCStore;
    });
    it("should send the transaction with address, amount and private key", function() {
        var orgencryptedPrivateKey = encryptedPrivateKey;

        // test priv key
        encryptedPrivateKey = CryptoJS.AES.encrypt('5KGMJim4coC9HqZuXw9pNpm8GyVw5tffD2mXEGXUdpBQvzAurw4','test').toString();

        var find = $().find();
        jQueryStub.prototype.find = function(selector){
            if(selector === 'input.login')
                return {
                    focus: function(){},
                    val: function(){

                        // decrypt password
                        return 'test';
                    }
                }
            else
                return find;
        };


        showSendConfirm('17gH3YynN34VVRhwwrnEjfc31LnpP7rcTm',1.0);

        // tests
        $.ajax = function(options) {

            expect(options.data.to).toEqual('17gH3YynN34VVRhwwrnEjfc31LnpP7rcTm');
            expect(options.data.amount).toEqual(1.0 * 100000000);
            expect(options.url.indexOf('5KGMJim4coC9HqZuXw9pNpm8GyVw5tffD2mXEGXUdpBQvzAurw4')).not.toEqual(-1);

            return {
                always: function(){
                    return {
                        done: function(callback){
                            // callback();

                            return {
                                fail: function(){}
                            };
                        }
                    };
                }
            };
        }

        // run test
        $('#sendConfirm button.confirm').trigger('click');


        encryptedPrivateKey = orgencryptedPrivateKey;
    });
});



// // WALLET
// describe("XXXshowWallet()", function() {
//     var jq = $,
//         orgCStore = _.clone(cStore);

//     beforeEach(function(){

        

//     });
//     afterEach(function(){
//         $ = jq;
//         cStore = orgCStore;
//     });
//     it("should generate and encrypt private and public key", function() {

//         showWallet();

//     });
// });