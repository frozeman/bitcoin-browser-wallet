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

The MIT License (MIT)

Copyright (c) 2014 Fabian Vogelsteller

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
