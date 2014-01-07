Bitcoin Browser Wallet
======================
Copyright by Fabian Vogelsteller [frozeman.de]

https://chrome.google.com/webstore/detail/bitcoin-browser-wallet/liopgbfpkngindhbgplllgjhfpcfnmig

A simple bitcoin wallet for your browser (Chrome Extension).

The Bitcoin Browser Wallet lets you easily send payments to anybody right from your browser. It detects bitcoin links on websites you're on to make payments fast and easy.
Your private key will be encrypted using your password and stored in Googles Sync storage, so you can access your wallet from any chrome browser.

This wallet uses the blockchain.info APIs for sending payments and retrieving balances.
The generated/imported private key is encrypted using a password and stored in the chrome sync/local storage


Install
-------

Simply go to the Chrome web-store[1] an click "add" 

 [1]: https://chrome.google.com/webstore/detail/bitcoin-browser-wallet/liopgbfpkngindhbgplllgjhfpcfnmig

To install Manually:

*   download the wallet code from [github][2].
*   Open chrome settings -> extensions
*   check developer mode
*   click "load unpacked extension"
*   select either the "bitcoin-browser-wallet" folder, or the "dist" folder inside. ("dist" is the folder created when you run "$ grunt dist", which concatenates all js files)

 [2]: http://github.com/frozeman/bitcoin-browser-wallet

Tests
-----

To run the tests, run the following from inside the bitcoin-browser-wallet folder

    $ karma start


Deploy
------

This will create the dist folder, with concatenated and uglified js files.

$ grunt dist



License
-------
This software is open source and licensed under MIT license.
