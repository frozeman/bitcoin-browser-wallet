//
// Bitcoin Browser Wallet (Chrome Extension)
// Copyright (c) 2013 Fabian Vogelsteller [frozeman.de]
// 
// This program is free software; you can redistribute it and/or modify
// it under the terms of the MIT license.




// -> INTERFACE

// CONSTANTS
var DECIMAL_POINTS = 100000000,
    TRANSACTION_FEE = 0.0001; // will be add by blockchain.info, this value here is only for display reasons

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
        $setup.find('input.importPrivkey').show();
        importPrivKey = true;


        // add qrcode scanner
        // $('#readPrivKey').html5_qrcode(function(data){
        //          // do something when code is read
        //     },
        //     function(error){
        //         //show read errors 
        //     }, function(videoError){
        //         //the video stream could be opened
        //     }
        // );
    });
    $setup.find('input.generatePrivRadio').on('change', function(){
        $setup.find('input.importPrivkey').hide();
        importPrivKey = false;
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
        $settings.find('.version').append(' <small>('+ remoteVersion +' <a href="https://chrome.google.com/webstore/detail/bitcoin-browser-wallet/liopgbfpkngindhbgplllgjhfpcfnmig" target="_blank">update available</a>)</small>');


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
       $('div.privateKeyQrcode').empty().attr('title','');
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

            // show private key QRCODE
            if($('div.privateKeyQrcode canvas').length === 0) {
                var qrcode = new QRCode((deleteWallet) ? $('div.privateKeyQrcode')[1] : $('div.privateKeyQrcode')[0], {
                    text: decodedPrivKey,
                    width: 190,
                    height: 190,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
            }

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
    $('div.privateKeyQrcode').empty().attr('title','');
    $settings.hide();
};


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
            var $availableAddresses = $('#wallet').find('.availableAddresses');
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


    // display own public key
    $wallet.find('a.walletAddress').text(publicKey).attr('href','http://blockchain.info/address/'+ publicKey);
    // as QRCODE
    var qrcode = new QRCode($('#walletAddressQrcode')[0], {
        text: publicKey,
        width: 130,
        height: 130,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });


    // set the balance on start
    displayBalance();
    
    // -> get balance every 10s
    getPriceIndex();
    getBalance();
    // run the balance check with a delay of 2s
    intervals.checkBalanceTimeout = setTimeout(function(){
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
    // show qr-code
    $wallet.find('button.icon.qrcode, #walletAddressQrcode').on('click', function(){
        $('#walletAddressQrcode').toggleClass('show');
        $wallet.find('.yourAddress a').toggleClass('show');
    });
    // show settings
    $wallet.find('button.settings').on('click', function(){
        showSettings();
        hideWallet();
    });
    // switch displayed currency
    $wallet.find('button.switchCurrency, button.symbol').on('click', function(){
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
        if($(this).data('amount')) {

            // add amount in USD or BTC
            var amount = (bStore.displayUSD) ? inUSD($(this).data('amount')) : $(this).data('amount');
            $sendAmount.val(amount).trigger('keyup').focus();
        }
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
    $('#walletAddressQrcode').empty().attr('title','').removeClass('show');
    $wallet.find('.yourAddress a').removeClass('show');
    $wallet.hide();
};



/**
* SEND CONFIRM
*
* This includes various checks and a confirmation page which is shown before the user finally sends his funds.
*/
var showSendConfirm = function(address, amount){
    var $sendConfirm = $('#sendConfirm');

    if(!_.isFinite(amount))
        amount = 0;

    // show
    $sendConfirm.show();
    if(bStore.displayUSD)
        $sendConfirm.find('span.amount').text(round(inUSD(amount),2) +' USD ('+ round(amount,8) +' BTC)');
    else
        $sendConfirm.find('span.amount').text(round(amount,8) +' BTC ('+ round(inUSD(amount),2) +' USD)');

    $sendConfirm.find('a.address').text(address).attr('href','http://blockchain.info/address/'+ address);
    $sendConfirm.find('input.login').focus();



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

                

                // GET TRANSACTION HISTORY
                $.ajax({
                    url: 'http://blockexplorer.com/q/mytransactions/'+ publicKey
                })
                .done(function(txHistory){

                    var result = parseTxs(txHistory, publicKey),
                        tx = createSend(address, publicKey, amount, TRANSACTION_FEE, result.unspenttxs, decodedPrivKey),
                        rawTransaction = Crypto.util.bytesToHex(tx.serialize());
                    decodedPrivKey = null;


                    // BROADCAST TRANSACTION TO THE BLOCKCHAIN
                    $.ajax({
                        url: 'https://blockchain.info/pushtx',
                        type: 'POST',
                        data: {
                            tx: rawTransaction
                        }
                    })
                    .always(function(){
                        bStore.paymentInProcess = false;
                        $('#loading').hide();
                        hideSendConfirm();
                    })
                    .done(function(response){

                        // successful, show transaction id
                        console.log('SUCCESS', response);
                        // showSuccess(response.tx_hash);

                        // update the balance in the background
                        bStore.balance = bStore.balance - amount - TRANSACTION_FEE;
                        displayBalance();

                        // store "first send done"
                        chrome.runtime.lastError = null;
                        cStore.set({ firstSend: true }, function(){
                            if(!chrome.runtime.lastError) {
                                firstSend = true;
                                displayBalance();
                            }
                        });


                    })
                    .fail(function(request){
                        console.log('error', request.responseText);
                        $wallet.find('.transactionFailed > p').text(request.responseText).parent().show();
                    });


                })
                .fail(function(){
                    $wallet.find('.transactionRequestFailed').show();
                    
                    bStore.paymentInProcess = false;
                    $('#loading').hide();
                    hideSendConfirm();
                })



                // // -> SEND TRANSACTION VIA BLOCKCHAIN.INFO
                // $.ajax({
                //     url: 'https://blockchain.info/merchant/'+ decodedPrivKey +'/payment',
                //     data: {
                //         to: address,
                //         amount: parseInt(amount * DECIMAL_POINTS)
                //     }
                // })
                // .always(function(){
                //     bStore.paymentInProcess = false;
                //     $('#loading').hide();
                //     hideSendConfirm();
                // })
                // .done(function(response){

                //     // stringify if thats not happened
                //     if(_.isString(response))
                //         response = JSON.parse(response);

                //     // show SUCCESS
                //     if(_.isObject(response) && _.isEmpty(response.error) && !_.isEmpty(response.tx_hash)) {

                //         // successful, show transaction id
                //         showSuccess(response.tx_hash);

                //         // update the balance in the background
                //         bStore.balance = bStore.balance - amount - TRANSACTION_FEE;
                //         displayBalance();

                //         // store first send done
                //         chrome.runtime.lastError = null;
                //         cStore.set({ firstSend: true }, function(){
                //             if(!chrome.runtime.lastError) {
                //                 firstSend = true;
                //                 displayBalance();
                //             }
                //         });

                //     // show ERROR
                //     } else {
                //         $wallet.find('.transactionFailed > p').text(response.error);
                //         $wallet.find('.transactionFailed').show();
                //     }

                // })
                // .fail(function(){
                //     $wallet.find('.transactionRequestFailed').show();
                // });



            // wrong password
            } else {
                hideSendConfirm();
                $wallet.find('.passwordWrong').show();
            }
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
        $wallet.find('.balance .number').text(round(inUSD(bStore.balance),2));
        $wallet.find('.balance .symbol').text('USD');
        $wallet.find('button.symbol').text('USD');
        $wallet.find('input.sendAmount').attr('placeholder','0.00');
        $wallet.find('input.sendAmount').attr('step','0.01');
    } else {
        $wallet.find('.balance .number').text(round(bStore.balance,8));
        $wallet.find('.balance .symbol').text('BTC');
        $wallet.find('button.symbol').text('BTC');
        $wallet.find('input.sendAmount').attr('placeholder','0.00000000');
        $wallet.find('input.sendAmount').attr('step','0.001');
    }
    $wallet.find('span.currentPrice').text(round(bStore.currentPrice,2) +' USD/BTC').attr('title','Bitstamp.net');
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
* Round to decimal points
*
*/
var round = function(number, decimal){
    if(_.isFinite(number)) {
        return (number * 1).toFixed(decimal);
    } else {
        return 0;
    }
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


/**
* Parses the transaction history
*
*/
var parseTxs = function(data, address) {
    /* JSON structure:
        root
         transaction hash
            hash (same as above)
            version
            number of inputs
            number of outputs
            lock time
            size (bytes)
            inputs
             previous output
                hash of previous transaction
                index of previous output
             scriptsig (replaced by "coinbase" on generation inputs)
             sequence (only when the sequence is non-default)
             address (on address transactions only!)
            outputs
             value
             scriptpubkey
             address (on address transactions only!)
            block hash
            block number
            block time
    */
    var tmp = JSON.parse(data);
    var txs = [];
    for (var a in tmp) {
        if (!tmp.hasOwnProperty(a))
            continue;
        txs.push(tmp[a]);
    }

    
    // Sort chronologically
    txs.sort(function(a,b) {
        if (a.time > b.time) return 1;
        else if (a.time < b.time) return -1;
        return 0;
    })

    delete unspenttxs;
    var unspenttxs = {}; // { "<hash>": { <output index>: { amount:<amount>, script:<script> }}}

    var balance = BigInteger.ZERO;

    // Enumerate the transactions 
    for (var a in txs) {
    
        if (!txs.hasOwnProperty(a))
            continue;
        var tx = txs[a];
        if (tx.ver != 1) throw "Unknown version found. Expected version 1, found version "+tx.ver;
        
        // Enumerate inputs
        for (var b in tx.in ) {
            if (!tx.in.hasOwnProperty(b))
                continue;
            var input = tx.in[b];
            var p = input.prev_out;
            var lilendHash = endian(p.hash)
            // if this came from a transaction to our address...
            if (lilendHash in unspenttxs) {
                unspenttx = unspenttxs[lilendHash];
                
                // remove from unspent transactions, and deduce the amount from the balance
                if(unspenttx[p.n])
                    balance = balance.subtract(unspenttx[p.n].amount);
            delete unspenttx[p.n]
                if (isEmpty(unspenttx)) {
                    delete unspenttxs[lilendHash]
                }
            }
        }
        
        // Enumerate outputs
        var i = 0;
        for (var b in tx.out) {
            if (!tx.out.hasOwnProperty(b))
                continue;
                
            var output = tx.out[b];
            
            // if this was sent to our address...
            if (output.address == address) {
                // remember the transaction, index, amount, and script, and add the amount to the wallet balance
                var value = btcstr2bignum(output.value);
                var lilendHash = endian(tx.hash)
                if (!(lilendHash in unspenttxs))
                    unspenttxs[lilendHash] = {};
                unspenttxs[lilendHash][i] = {amount: value, script: output.scriptPubKey};
                balance = balance.add(value);
            }
            i = i + 1;
        }
    }
    return {balance:balance, unspenttxs:unspenttxs};
};


/**
* Create raw transaction
*
*/
function createSend(address, changeAddress, sendValue, feeValue, unspenttxs, privKey) {
    var selectedOuts = [],
        txValue = sendValue.add(feeValue),
        availableValue = BigInteger.ZERO;

    sendValue = btcstr2bignum(sendValue);
    feeValue = btcstr2bignum(feeValue);
    address = new Bitcoin.Address(address);
    changeAddress = new Bitcoin.Address(changeAddress);
    
    for (var hash in unspenttxs) {
        if (!unspenttxs.hasOwnProperty(hash))
            continue;
        for (var index in unspenttxs[hash]) {
            if (!unspenttxs[hash].hasOwnProperty(index))
                continue;
            var script = parseScript(unspenttxs[hash][index].script);
            var b64hash = Crypto.util.bytesToBase64(Crypto.util.hexToBytes(hash));
            selectedOuts.push(new Bitcoin.TransactionIn({outpoint: {hash: b64hash, index: index}, script: script, sequence: 4294967295}));
            availableValue = availableValue.add(unspenttxs[hash][index].amount);
            if (availableValue.compareTo(txValue) >= 0) break;
        }
    }

    if (availableValue.compareTo(txValue) < 0) {
      throw new Error('Insufficient funds.');
    }


    var changeValue = availableValue.subtract(txValue);

    var sendTx = new Bitcoin.Transaction();

    for (var i = 0; i < selectedOuts.length; i++) {
        sendTx.addInput(selectedOuts[i]);
    }
    sendTx.addOutput(address, sendValue);
    if (changeValue.compareTo(BigInteger.ZERO) > 0) {
        sendTx.addOutput(changeAddress, changeValue);
    }
    
    var hashType = 1; // SIGHASH_ALL
    // add private key to Bitcoin instance
    var res = parseBase58Check(privKey),
        key = new Bitcoin.ECKey(res[1]);
    
    for (var i = 0; i < sendTx.ins.length; i++) {
        var hash = sendTx.hashTransactionForSignature(selectedOuts[i].script, i, hashType);
        var pubKeyHash = selectedOuts[i].script.simpleOutPubKeyHash();
        
        // SIGN with RPIVATE KEY
        var signature = key.sign(hash);

        // Append hash type
        signature.push(parseInt(hashType));

        sendTx.ins[i].script = Bitcoin.Script.createInputScript(signature, key.getPub());
    }
    
    return sendTx;
};

/**
* endian
*
*/
var endian = function(string) {
    var out = []
    for(var i = string.length; i > 0; i-=2) {
        out.push(string.substring(i-2,i));
    }
    return out.join("");
};


/**
* btcstr2bignum
*
*/
var btcstr2bignum = function(btc) {
    btc = btc.toString();
    var i = btc.indexOf('.');
    var value = new BigInteger(btc.replace(/\./,''));
    var diff = 9 - (btc.length - i);
    if (i == -1) {
        var mul = "100000000";
    } else if (diff < 0) {
        return value.divide(new BigInteger(Math.pow(10,-1*diff).toString()));
    } else {
        var mul = Math.pow(10,diff).toString();
    }
        return value.multiply(new BigInteger(mul));
};

/**
* parseScript
*
*/
var parseScript = function(script) {
    var newScript = new Bitcoin.Script();
    var s = script.split(" ");
    for (var i in s) {
        if (Bitcoin.Opcode.map.hasOwnProperty(s[i])){
            newScript.writeOp(Bitcoin.Opcode.map[s[i]]);
        } else {
            newScript.writeBytes(Crypto.util.hexToBytes(s[i]));
        }
    }
    return newScript;
}

/**
* isEmpty
*
*/
function isEmpty(ob) {
    for(var i in ob){ if(ob.hasOwnProperty(i)){return false;}}
    return true;
}
