// I18N

var i18n = {
    'en': {
        'button': {
            'decrypt': 'DECRYPT',
            'cancel': 'CANCEL',
            'ok': 'OK',
            'confirm': 'CONFIRM'
        },
        'setup': {
            'generateNewAddress': ' Generate new Address',
            'importPrivateKey':  ' Import Private Key',
            'button': {
                'create': 'CREATE',
            },
            'error': {
                'runtime': {
                    'title': ' Error'
                },
                'passwordMismatch': {
                    'title': ' Password mismatch!',
                    'text': 'Make also sure to choose a secure password and remember it well.'
                },
                'invalidKey': {
                    'title': ' Invalid Private Key!',
                    'text': 'Your private key field is either empty or not a valid private key.'
                }
            },
            'info': {
                'setupHint': {
                    'title1': ' Key',
                    'text1': 'The private key will be encrypted using your password and stored in the Chrome sync storage (When you activated sync in Chrome\'s preferences, otherwise locally).',
                    'title2': 'Transactions',
                    'text2': 'Transactions will be send using the <a href="https://blockchain.info/en/api/blockchain_wallet_api" target="_blank">Blockchain Wallet API</a>, therefor your private key will be send to the blockchain.info server over HTTPS when making a payment.',
                    'title3': 'Note',
                    'text3': 'I recommend using this wallet only with small amounts of Bitcoin for day to day payments.'
                }
            }
        },
        'wallet': {
            'yourAddress': 'Your Address<br>',
            'availableAddresses': 'This website contains the following addresses',
            'button': {
                'send': 'SEND'
            },
            'error': {
                'invalidAddress': {
                    'title': ' Invalid Address',
                    'text': 'The receiving address doesn\'t seem to be a valid bitcoin address.'
                },
                'invalidAmount': {
                    'title': ' Invalid Amount',
                    'text': 'The amount you want to send must be a number and greater zero.<br>And use \'.\' as decimal separator.'
                },
                'transactionFailed': {
                    'title': ' Transaction failed',
                    'text': 'Your transaction could not be processed.'
                },
                'transactionRequestFailed': {
                    'title': ' Transaction request failed',
                    'text': 'The blockchain.info server couldn\'t be reached, please try again later.'
                },
                'passwordWrong': {
                    'title': ' Password Wrong!',
                    'text': 'The password you entered was wrong, please try again.'
                }
            },
            'info': {
                'noTransaction': {
                    'title': ' You didn\'t send any transaction yet!',
                    'text': 'Why not sending a donation for this project and see how it works?<br><a href="#" class="donate">17gH3YynN34VVRhwwrnEjfc31LnpP7rcTm</a>'
                },
                'noFunds': {
                    'title': ' Your Wallet is empty!',
                    'text1': 'Send some bitcoin to your address to get started:<br><a href="#" class="walletAddress" target="_blank"></a>',
                    'text2': 'I recommend using this wallet not for your savings. Just add 10-100 USD which you will need for every day use.'
                }
            }
        },
        'settings': {
            'credits': 'Bitcoin Browser Wallet copyright by Fabian Vogelsteller [<a href="http://frozeman.de" target="_blank">frozeman.de</a>]<br>This software is licensed under MIT license.<br><br>'+
                        'Feedback: <a href="mailto:bitcoin@frozeman.de">bitcoin@frozeman.de</a><br>'+
                        'Bugs: <a href="http://github.com/frozeman/bitcoin-browser-wallet/issues" target="_blank">Github</a><br><br>'+
                        'To support this project please donate <a href="#" class="donate">17gH3YynN34VVRhwwrnEjfc31LnpP7rcTm</a>',
            'walletWillNotBeDeleted': 'Your wallet will <strong>not</strong> be deleted, yet.<br>First enter your password to decrypt your private key.',
            'decryptYourPrivateKey': 'Enter your password to decrypt your private key.',
            'privateKeyInfo': 'This is the important key of your wallet keep it safe and don\'t share it with anybody!',
            'deleteWalletInfoText': '<strong>This will permanently delete your public and private Wallet key!</strong><br>'+
                                    'Write down your private key for use with another wallet,<br>'+
                                    ' or move all your funds to another address before confirming!',
            'button': {
                'showPrivateKey': ' Show Privatekey',
                'deleteWallet': ' Delete/Reset Wallet',
            },
            'error': {
                'deletionFailed': {
                    'title': ' Wallet couldn\'t be deleted'
                }
            }
        },
        'sendConfirm': {
            'sendText': 'Send <span class="amount">0.0</span> to', // dont change the <span class="amount"></span>
            'feeHint': '0.0001 transaction fee will be add (required by the network).'
        },
        'success': {
            'transactionId': 'Transaction ID:'
        }
    }
};