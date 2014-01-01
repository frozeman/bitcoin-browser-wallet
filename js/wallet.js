//
// Bitcoin Browser Wallet (Chrome Extension)
// Copyright (c) 2013 Fabian Vogelsteller [frozeman.de]
// 
// This program is free software; you can redistribute it and/or modify
// it under the terms of the MIT license.


    // "http://*/",
    // "https://*/",
    // "tabs",  
    // "http://*/*",
    // "https://*/*",

  // "content_scripts": [
  //   {
  //     "matches": ["http://*/*","https://*/*"],
  //     "js": ["js/jquery-2.0.3.min.js", "js/addressFetcher.js"],
  //     "run_at": "document_end",
  //     "all_frames": false
  //   }
  // ],



// -> INTERFACE

// CONSTANTS
var DECIMAL_POINTS = 100000000,
    TRANSACTION_FEE = 0.0001;

// VARS
var bStore = chrome.extension.getBackgroundPage().storage,
    cStore = chrome.storage.sync,
    intervals = {};
    encryptedPrivateKey = '',
    publicKey = '',
    firstSend = false,
    version = null,
    remoteVersion = null;

// local version
$.getJSON('../manifest.json', function(data) {
    version = data.version;
});
// version on github master
$.getJSON('https://raw.github.com/frozeman/bitcoin-browser-wallet/master/manifest.json', function(data) {
    remoteVersion = data.version;
});



/**
* A very simple self made localization function.
* uses the imported i18n.js file and displays the lang strings.
*
*/
var addI18n = function(lang){
    $('*[data-i18n]').each(function(){
        var key = $(this).data('i18n').split('.');

        // stupid but works
        if(key.length === 2)
            $(this).append(i18n[lang][key[0]][key[1]]);
        if(key.length === 3)
            $(this).append(i18n[lang][key[0]][key[1]][key[2]]);
        if(key.length === 4)
            $(this).append(i18n[lang][key[0]][key[1]][key[2]][key[3]]);
    });
};
var lang = (navigator.language.substr(0,2) === 'de')? 'de' : 'en';
addI18n(lang);


// get users private and public key
cStore.get(['privateKey','publicKey','firstSend'], function(store){

    if(store.privateKey) {
        encryptedPrivateKey = store.privateKey;
        publicKey = store.publicKey;
        firstSend = store.firstSend;
        showWallet();
    } else {
        showSetup();
    }
});



/**
* SETUP
*
* Will generate or import a private and public key for the wallet
* and encrypt it using a user choosen password.
*
*/
var showSetup = function(){
    var importPrivKey = false,
        $setup = $('#setup'),
        $password = $setup.find('.password'),
        $passwordCorfirm = $setup.find('.passwordConfirm');

    // show
    $setup.show();


    // Attach events
    $setup.find('input').on('keypress', function(e){
        if(e.keyCode === 13)
            $setup.find('button.create').trigger('click');
    });
    $setup.find('input.importPrivRadio').on('change', function(){
        if($(this).val()) {
            $setup.find('input.importPrivkey').show();
            importPrivKey = true;
        }
    });
    $setup.find('input.generatePrivRadio').on('change', function(){
        if($(this).val()) {
            $setup.find('input.importPrivkey').hide();
            importPrivKey = false;
        }
    });

    // CREATE ACCOUNT
    $setup.find('button.create').on('click', function(){
        // check passwords
        if(!_.isEmpty($password.val())) {

            if($password.val() === $passwordCorfirm.val()) {

                // -> import a private key
                if(importPrivKey) {
                    var privKey = $setup.find('input.importPrivkey').val(),
                        pubKey = getPublicKey(privKey);

                    // store the priv/pub key
                    if(_.isEmpty(privKey) || !pubKey)
                        $setup.find('.invalidPrivateKey').show();

                // -> generate a private key
                } else {
                    var privKey = generatePrivKey(),
                        pubKey = generatePublicKey(privKey.bytes);

                    if(pubKey)
                        privKey = privKey.WIF;

                }

                // store the priv/pub key
                if(!_.isEmpty(privKey) && !_.isEmpty(pubKey)) {

                    privKey = CryptoJS.AES.encrypt(privKey, $password.val()).toString();

                    if(privKey) {

                        chrome.runtime.lastError = null;
                        cStore.set({
                            firstSend: false,
                            privateKey: privKey,
                            publicKey: pubKey
                        }, function(){

                            if(!chrome.runtime.lastError) {

                                encryptedPrivateKey = privKey;
                                publicKey = pubKey;

                                hideSetup();
                                showWallet();
                            } else {
                                $setup.find('.runtimeError > p').append(chrome.runtime.lastError.message);
                                $setup.find('.runtimeError').show();
                            }

                        });
                    }
                }
                
                
            } else
                $setup.find('.passwordMismatch').show();
        }
    });

};
var hideSetup = function(){
    var $setup = $('#setup');

    $setup.find('input.importPrivkey').hide();
    $setup.find('input').val('');
    $setup.find('.message > .error, .message > .info').hide();
    $setup.find('*').off('click change keyup keypress');
    $setup.hide();
};




/**
* SETTINGS
*
* Allow the user to display his private key and delete teh wallet.
* Will also display the wallets version and credits.
*/
var showSettings = function(){
    var $settings = $('#settings'),
        $showKey = $('#showKey'),
        deleteWallet = false,
        confirmedDeletion = false;

    // show
    $settings.show();

    // show version
    // TODO: show update note??
    $settings.find('.version').text(version);
    if(version < remoteVersion)
        $settings.find('.version').append(' <small>('+ remoteVersion +' <a href="http://frozeman.de" target="_blank">update available</a>)</small>');


    // ATTACH EVENTS
    // hide settings
    $settings.find('button.close').on('click', function(){
        hideSettings();
        showWallet();
    });
    // show wallet and add the donation address
    $settings.find('a.donate').on('click', function(){
        hideSettings();
        showWallet();
        $('#wallet').find('input.btcAddress').val($(this).text()).trigger('keyup');
        $('#wallet').find('input.sendAmount').focus();
    });
    // send on enter
    $settings.find('#settingsConfirm input').on('keypress', function(e){
        if(e.keyCode === 13)
            $settings.find('#settingsConfirm button.confirm').trigger('click');
    });
    $settings.find('#showKey input').on('keypress', function(e){
        if(e.keyCode === 13)
            $settings.find('#showKey button.confirm').trigger('click');
    });

    // show private key confirm
    $settings.find('button.showKey').on('click', function(){
       $('#settingsConfirm').show().find('.showPrivateKeyText').show();
       $('#settingsConfirm').find('input.login').focus();
       deleteWallet = false;
    });
    // show delete wallet confirm
    $settings.find('button.deleteWallet').on('click', function(){
        $('#settingsConfirm').show().find('.deleteWalletText').show();
        $('#settingsConfirm').find('input.login').focus();
        deleteWallet = true;
    });

    // hide confirms
    $('#settingsConfirm').find('button.cancel').on('click', function(){
       $('#settingsConfirm').hide().find('.deleteWalletText, .showPrivateKeyText').hide();
       $('#settingsConfirm').find('input.login').val('');
       $settings.find('#settingsConfirm .passwordWrong').hide();
       deleteWallet = false;
    });



    // -> show private key
    $settings.find('button.confirm').on('click', function(){
        $settings.find('#settingsConfirm .passwordWrong').hide();

        try {
            decodedPrivKey = CryptoJS.AES.decrypt(encryptedPrivateKey, $settings.find('#settingsConfirm input.login').val()).toString(CryptoJS.enc.Utf8);
        } catch(error) {
            decodedPrivKey = false;
        }

        // all went right
        if(!_.isEmpty(decodedPrivKey)) {

            $('#settingsConfirm').hide().find('.deleteWalletText, .showPrivateKeyText').hide();
            $showKey.show().find('input.privKey').val(decodedPrivKey);

            // show private key
            if(deleteWallet) {
                $showKey.find('.deleteWallet').show();
                confirmedDeletion = true;

            // delete wallet
            } else {
                $showKey.find('.showKey').show();
            }
        } else {
            $settings.find('#settingsConfirm .passwordWrong').show();
        }

        decodedPrivKey = null;
    });

    // hide private key
    $showKey.find('button.ok, button.cancel').on('click', function(){
        $showKey.find('input.privKey').val('');
        $showKey.find('.deleteWallet, .showKey').hide();
        $('#settingsConfirm').find('button.cancel').trigger('click');
        $showKey.hide();
    });

    // confirm DELETE WALLET
    $showKey.find('button.confirm').on('click', function(){

        // DELETE WALLET KEYS
        if(confirmedDeletion) {
            chrome.runtime.lastError = null;
            cStore.remove(['privateKey','publicKey'], function(){

                if(!chrome.runtime.lastError) {
                    confirmedDeletion = false;
                    encryptedPrivateKey = null;
                    publicKey = null;
                    bStore.balance = 0;
                    bStore.currentAddress = null;
                    bStore.currentAmount = null;
                    bStore.displayUSD = null;
                    bStore.currentPrice = null;
                    bStore.paymentInProcess = null;

                    // hide showKey
                    $showKey.find('button.cancel').trigger('click');
                    hideSettings();
                    hideWallet();
                    showSetup();
                
                // show error
                } else {
                    $showKey.find('.deletionFailed').show().find('p').append(chrome.runtime.lastError);
                }
            });

        }

    });

};
var hideSettings = function(){
    var $settings = $('#settings');

    $settings.find('input').val('');
    $settings.find('.message > .error, .message > .info').hide();
    $settings.find('*').off('click change keyup keypress');
    $settings.hide();
};




/**
* WALLET
*
* Displays the user wallet balance and 
* lets the user send bitcoin to other addresses.
*/
var showWallet = function(){
    var $wallet = $('#wallet'),
        $sendAddress = $wallet.find('.btcAddress'),
        $sendAmount = $wallet.find('.sendAmount');

    // show
    $wallet.show();

    // DEV
    // showSuccess('8e0e21ef77a73d30fe5e1bc52809c1e67fd5c6c929d8efacb6e6b70e99e75bde');

    // -> FETCH BTC ADDRESSES FROM CURRENT TAB

    // fetch BTC address from the current tab
    chrome.tabs.executeScript(null, {file:"/js/vendor/underscore-min.js"}, function() {
        chrome.tabs.executeScript(null, {file:"/js/vendor/jquery-2.0.3.min.js"}, function(){
            chrome.tabs.executeScript(null, { file: "/js/addressFetcher.js"});
        });
    });
    // retrieve addresses
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        // console.log(sender.tab ?
        //             "from a content script:" + sender.tab.url :
        //             "from the extension", request.btcAdresses);

        // when addresses were received, add them to a list
        if(!_.isEmpty(request.btcAdresses)) {

            setTimeout(function(){
                var $availableAddresses = $wallet.find('.availableAddresses');
                _.each(request.btcAdresses, function(btcAdresses){
                    var $button = $('<button><span class="icon-qrcode"></span><span class="text"></span></button>');

                    // append to the list
                    $availableAddresses.children('ul').append($('<li>').append($button));

                    // add address
                    $button.data('address', btcAdresses.address).find('span.text').text(' '+ btcAdresses.address);

                    if(btcAdresses.amount > 0)
                        $button.data('amount', btcAdresses.amount).append(' > '+ btcAdresses.amount +' BTC');

                });
                $availableAddresses.show();
            }, 200);
        }
    });
    

    // display own public key
    $wallet.find('a.publicKey, a.walletAddress').text(publicKey).attr('href','http://blockchain.info/address/'+ publicKey);


    // set the balance on start
    displayBalance();
    
    // -> get balance every 10s
    getPriceIndex();
    // run the balance check with a delay of 2s
    intervals.checkBalanceTimeout = setTimeout(function(){
        getBalance();
        intervals.checkBalance = setInterval(function(){
            // console.log('checking balance...');
            getBalance();
        }, 10000);
    }, 2000);
    // check the price index after 10s
    intervals.checkPrice = setInterval(function(){
        getPriceIndex();
    }, 10000);

    
    // -> retrieve last typed address
    if(bStore.currentAddress) {
        $sendAddress.val(bStore.currentAddress);
        setTimeout(function(){
            $sendAmount.focus();
        }, 100);
    }
    // -> retrieve last typed send amount
    $sendAmount.val(bStore.currentAmount);
    


    // ATTACH EVENTS
    // show settings
    $wallet.find('button.settings').on('click', function(){
        showSettings();
        hideWallet();
    });
    // switch displayed currency
    $wallet.find('button.switchCurrency').on('click', function(){
        bStore.displayUSD  = (bStore.displayUSD) ? false : true;
        displayBalance();
        getPriceIndex();
    });
    // store currently typed address
    $sendAddress.on('keyup change', function(){
        bStore.currentAddress = $(this).val();
    });
    // store currently typed address
    $sendAmount.on('keyup change', function(){
        var val = $(this).val();

        // make sure all "," are replaced with "."
        if(val.indexOf(',') != -1)
            $(this).val(val.replace(/\,/g,'.'));

        bStore.currentAmount = val;
    });
    $wallet.find('input').on('keypress', function(e){
        if(e.keyCode === 13)
            $wallet.find('button.send').trigger('click');
    });
    // add donation address to form when clicked
    $wallet.find('.message').on('click','a.donate', function(){
        $sendAddress.val($(this).text()).trigger('keyup');
        $sendAmount.focus();
    });
    // add available address to form when clicked
    $wallet.find('.availableAddresses').on('click','button', function(){
        $sendAddress.val($(this).data('address')).trigger('keyup');
        if($(this).data('amount'))
            $sendAmount.val($(this).data('amount')).trigger('keyup').focus();
    });

    // -> start payment
    $wallet.find('button.send').on('click', function(){
        var address = $sendAddress.val(),
            amount = $sendAmount.val();

        // if value was given in USD, calculate the biycoin price
        if(bStore.displayUSD) {
            amount = inBTC(amount);
        }

        $wallet.find('.error').hide();

        if(validateAddress(address)) {

            if(_.isFinite(amount) && amount != 0) {

                // show password form
                showSendConfirm(address, amount);

            } else
                $wallet.find('.invalidSendAmount').show();
        } else
            $wallet.find('.invalidSendAddress').show();
    });


};
var hideWallet = function(){
    var $wallet = $('#wallet');
    clearTimeout(intervals.checkBalanceTimeout);
    clearInterval(intervals.checkBalance);
    clearInterval(intervals.checkPrice);

    $wallet.find('input').val('');
    $wallet.find('.message > *').hide();
    $wallet.find('.message > .error, .message > .info').hide();
    $wallet.find('*').off('click keyup keypress change');
    $wallet.hide();
};



/**
* SEND CONFIRM
*
* This includes various checks and a confirmation page which is shown before the user finally sends his funds.
*/
var showSendConfirm = function(address, amount){
    var $sendConfirm = $('#sendConfirm');


    // make sure its not more than 8 decimal points
    amount = roundBTC(amount);


    // show
    $sendConfirm.show();
    $sendConfirm.find('input.login').focus();
    $sendConfirm.find('span.amount').text(amount +' BTC ('+ inUSD(amount) +' USD)');
    $sendConfirm.find('a.address').text(address).attr('href','http://blockchain.info/address/'+ address);



    // attach events
    // close login window
    $sendConfirm.find('button.cancel').on('click', function(){
        hideSendConfirm();
    });
    $sendConfirm.find('input').on('keypress', function(e){
        if(e.keyCode === 13)
            $sendConfirm.find('button.confirm').trigger('click');
    });

    // -> SEND PAYMENT
    $sendConfirm.find('button.confirm').on('click', function(){
        $wallet = $('#wallet');

        // prevent "double spends"
        if(!bStore.paymentInProcess) {
            var decodedPrivKey;

            try {
                decodedPrivKey = CryptoJS.AES.decrypt(encryptedPrivateKey, $sendConfirm.find('input.login').val()).toString(CryptoJS.enc.Utf8);
            } catch(error) {
                decodedPrivKey = false;
            }

            // all went right
            if(!_.isEmpty(decodedPrivKey)) {

                bStore.paymentInProcess = true;
                $('#loading').show();

                // -> SEND TRANSACTION VIA BLOCKCHAIN.INFO
                $.ajax({
                    url: 'https://blockchain.info/merchant/'+ decodedPrivKey +'/payment',
                    data: {
                        to: address,
                        amount: amount * DECIMAL_POINTS 
                    }
                })
                .always(function(){
                    bStore.paymentInProcess = false;
                    $('#loading').hide();
                    hideSendConfirm();
                })
                .done(function(response){

                    // stringify if thats not happened
                    if(_.isString(response))
                        response = JSON.parse(response);

                    // show SUCCESS
                    if(_.isObject(response) && _.isEmpty(response.error) && !_.isEmpty(response.tx_hash)) {

                        // successful, show transaction id
                        showSuccess(response.tx_hash);

                        // update the balance in the background
                        bStore.balance = bStore.balance - amount - TRANSACTION_FEE;
                        displayBalance();

                        // store first send done
                        chrome.runtime.lastError = null;
                        cStore.set({ firstSend: true }, function(){
                            if(!chrome.runtime.lastError) {
                                firstSend = false;
                                displayBalance();
                            }
                        });

                    // show ERROR
                    } else {
                        $wallet.find('.transactionFailed > p').text(response.error);
                        $wallet.find('.transactionFailed').show();
                    }

                })
                .fail(function(){
                    $wallet.find('.transactionRequestFailed').show();
                });



            // wrong password
            } else {
                hideSendConfirm();
                $wallet.find('.passwordWrong').show();
            }

            decodedPrivKey = null;
        }

    });
};
var hideSendConfirm = function(){
    var $sendConfirm = $('#sendConfirm');

    $sendConfirm.find('input').val('');
    $sendConfirm.find('*').off('click keypress');
    $sendConfirm.hide();
};


/**
* SUCCESS PAGE
*
* Shows the success page to after successfully send an transaction.
*/
var showSuccess = function(txHash){
    var $success = $('#success');

    $success.find('button.ok').on('click', function(){
        hideSuccess();
    });

    $success.show();
    $success.find('a.transactionId').text(txHash).attr('href','http://blockchain.info/tx/'+ txHash);
};
var hideSuccess = function(){
    $('#success').hide().find('*').off('click');
    $('#success').find('input').val('');

    bStore.currentAmount = null;
    bStore.currentAddress = null;

    $('#wallet').find('input').val('');
};








// METHODS


/**
* Retrives the balance of the users address.
*
*/
var getBalance = function(){

    return $.ajax({
        url: "https://blockchain.info/q/addressbalance/"+ publicKey, //"https://blockchain.info/address/"+ publicKey,
        // data: {
        //     format: 'json',
        //     limit: 0
        // }
    }).done(function(data){

        bStore.balance = data / DECIMAL_POINTS; // .final_balance
        // bStore.balance = undefined;

        displayBalance();
    });
};

/**
* Retrives the current price for 1 bitcoin in USD from bitstamp.net.
*
*/
var getPriceIndex = function(){

    return $.ajax({
        url: "https://www.bitstamp.net/api/ticker/"
    }).done(function(data){
        bStore.currentPrice = data.last;

        displayBalance();
    });
};


/**
* Displays the balance in either BTC or USD
*
*/
var displayBalance = function(){
    var $wallet = $('#wallet');

    // ake sure there is a number balance
    if(!bStore.balance)
        bStore.balance = 0;


    // show message to load wallet
    if(bStore.balance)
        $wallet.find('.noFunds').hide();
    else
        $wallet.find('.noFunds').show();

    // -> display message 
    if(bStore.balance && !firstSend)
        $wallet.find('.noTransaction').show();
    else
        $wallet.find('.noTransaction').hide();


    // display USD or BTC
    if(bStore.displayUSD) {
        $wallet.find('.balance .number').text(inUSD(bStore.balance));
        $wallet.find('.balance .symbol').text('USD');
        $wallet.find('input.symbol').val('USD');
        $wallet.find('input.sendAmount').attr('placeholder','0.00');
        $wallet.find('input.sendAmount').attr('step','0.01');
    } else {
        $wallet.find('.balance .number').text(bStore.balance);
        $wallet.find('.balance .symbol').text('BTC');
        $wallet.find('input.symbol').val('BTC');
        $wallet.find('input.sendAmount').attr('placeholder','0.00000000');
        $wallet.find('input.sendAmount').attr('step','0.001');
    }
    $wallet.find('button.switchCurrency').attr('title','Bitstamp: '+ bStore.currentPrice +' USD/BTC');
};

/**
* Changes BTC into USD
*
*/
var inUSD = function(btc){
    return Math.round((btc * bStore.currentPrice) * 100) / 100;
};

/**
* Changes USD into BTC
*
*/
var inBTC = function(fiat){
    return Math.round((fiat / bStore.currentPrice) * DECIMAL_POINTS) / DECIMAL_POINTS;
};

/**
* Makes sure that BTC will "only" have 8 decimal points.
*
*/
var roundBTC = function(btc){
    return Math.round((btc) * DECIMAL_POINTS) / DECIMAL_POINTS;
};


/**
* Generates a bitcoin Private Key
*
*/
var generatePrivKey = function(){
    var randArr = new Uint8Array(32); //create a typed array of 32 bytes (256 bits)
    window.crypto.getRandomValues(randArr); //populate array with cryptographically secure random numbers

    //some Bitcoin and Crypto methods don't like Uint8Array for input. They expect regular JS arrays.
    var privateKeyBytes = []
    for (var i = 0; i < randArr.length; ++i)
      privateKeyBytes[i] = randArr[i];

    //hex string of our private key
    var privateKeyHex = Crypto.util.bytesToHex(privateKeyBytes).toUpperCase();

    var privateKeyAndVersion = "80" + privateKeyHex;
    var firstSHA = Crypto.SHA256(Crypto.util.hexToBytes(privateKeyAndVersion));
    var secondSHA = Crypto.SHA256(Crypto.util.hexToBytes(firstSHA));
    var checksum = secondSHA.substr(0, 8).toUpperCase();

    //append checksum to end of the private key and version
    var keyWithChecksum = privateKeyAndVersion + checksum;

    var privateKeyWIF = Bitcoin.Base58.encode(Crypto.util.hexToBytes(keyWithChecksum));

    return {
        bytes: privateKeyBytes,
        WIF: privateKeyWIF
    };
};

/**
* Gets the public key from a private key
*
*/
var getPublicKey = function(privKey){

    try { 
        var res = parseBase58Check(privKey);
        return new Bitcoin.ECKey(res[1]).getBitcoinAddress().toString();
    } catch (err) {
        return false;
    };
};

/**
* Generates the public key from a private keys bytes
*
*/
var generatePublicKey = function(privateKeyBytes){
    //privateKeyBytes is the private key array from the top
    var eckey = new Bitcoin.ECKey(privateKeyBytes);
    // var publicKeyHex = Crypto.util.bytesToHex(eckey.getPub());
    return eckey.getBitcoinAddress().toString();
};

/**
* Parses a Base58 key and validates it.
*
*/
var parseBase58Check = function(address) {
    var bytes = Bitcoin.Base58.decode(address);
    var end = bytes.length - 4;
    var hash = bytes.slice(0, end);
    var checksum = Crypto.SHA256(Crypto.SHA256(hash, {asBytes: true}), {asBytes: true});
    if (checksum[0] != bytes[end] ||
        checksum[1] != bytes[end+1] ||
        checksum[2] != bytes[end+2] ||
        checksum[3] != bytes[end+3])
            throw new Error("Wrong checksum");
    var version = hash.shift();
    return [version, hash];
};

/**
* Validates a bitcoin address (public key)
*
*/
var validateAddress = function(address){
    try {
        Bitcoin.Address(address);
        return true;
    } catch (err) {
        return false;
    }
};
