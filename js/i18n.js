// I18N

var i18n = {

    // EN
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
            'yourAddress': 'My Address<br>',
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
                    'text1': 'Send some (milli) Bitcoin to your address to get started:<br><a href="#" class="walletAddress" target="_blank"></a>',
                    'text2': 'I recommend using this wallet not for your savings. Just add 10-100 USD which you will need for every day use.',
                    'text3': 'To change your balance to USD just click on the balance.'
                }
            }
        },
        'settings': {
            'credits': 'Copyright by Fabian Vogelsteller [<a href="http://frozeman.de" target="_blank">frozeman.de</a>]<br>This software is open source and licensed under the MIT license.<br><br>'+
                        'Website: <a href="http://frozeman.de/blog/2014/01/bitcoin-browser-wallet" target="_blank">frozeman.de/blog/2014/01/bitcoin-browser-wallet</a><br>'+
                        'Feedback: <a href="mailto:bitcoin@frozeman.de" target="_blank">bitcoin@frozeman.de</a><br>'+
                        'Bugs: <a href="http://github.com/frozeman/bitcoin-browser-wallet/issues" target="_blank">Github</a><br><br>'+
                        'To support this project please send some (milli) Bitcoin to <a href="#" class="donate">17gH3YynN34VVRhwwrnEjfc31LnpP7rcTm</a><br><br>'+
                        'This Wallet uses Google Analytics which are publicised so everybody can see its usage: <a href="http://www.seethestats.com/site/bitcoin-browser-wallet.com" target="_blank">seethestats.com</a><br>'+
                        '<i>The tracking code sits in the background script of this extension and can\'t access your wallet popup.</i>',

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
            'send': 'Send',
            'to': 'To',
            'feeHint': '0.0001 BTC transaction fee will be add (required by the network).'
        },
        'success': {
            'transactionId': 'Transaction ID:'
        }
    },

    // DE
    'de': {
        'button': {
            'decrypt': 'ENTSCHLÜSSELN',
            'cancel': 'ABBRECHEN',
            'ok': 'OK',
            'confirm': 'BESTÄTIGEN'
        },
        'setup': {
            'generateNewAddress': ' Generiere neue Adresse',
            'importPrivateKey':  ' Importiere privaten Schlüssel',
            'button': {
                'create': 'ERSTELLEN',
            },
            'error': {
                'runtime': {
                    'title': ' Fehler'
                },
                'passwordMismatch': {
                    'title': ' Passwörter stimmen nicht überein!',
                    'text': 'Wähle außerdem eine sicheres Passwort und merke es dir gut.'
                },
                'invalidKey': {
                    'title': ' Ungültiger privater Schlüssel!',
                    'text': 'Dein privater Schlüssel ist entweder leer oder nicht gültig.'
                }
            },
            'info': {
                'setupHint': {
                    'title1': ' Schlüssel',
                    'text1': 'Dein privater Schlüssel wird mit Hilfe deines Passworts verschlüsselt in der Chrome Cloud gespeichert (D.h wenn du Chromes Sync-Feature in den Einstellungen eingeschaltet hast, ansonsten lokal).',
                    'title2': 'Überweisungen',
                    'text2': 'Überweisungen werden mit Hilfe der <a href="https://blockchain.info/en/api/blockchain_wallet_api" target="_blank">Blockchain Wallet API</a> gesendet. Aus diesem Grund wird dein privater Schlüssel über HTTPS an die blockchain.info server gesendet wenn du eine Überweisungen machst.',
                    'title3': 'Bemerkung',
                    'text3': 'Ich empfehle dieses Portemonnaie nicht deine Ersparnisse zu verwenden, sondern nur für kleinere Beträge die du für alltägliche Zwecke brauchst.'
                }
            }
        },
        'wallet': {
            'yourAddress': 'Meine Adresse<br>',
            'availableAddresses': 'Diese Webseite enthält folgende Adressen',
            'button': {
                'send': 'SENDEN'
            },
            'error': {
                'invalidAddress': {
                    'title': ' Ungültige Adresse',
                    'text': 'Die empfänger Adresse scheint keine gültige bitcoin Adresse zu sein.'
                },
                'invalidAmount': {
                    'title': ' Ungültiger Betrag',
                    'text': 'Der Betrag muss eine Zahl und größer als 0 sein.'
                },
                'transactionFailed': {
                    'title': ' Überweisung fehlgeschlagen',
                    'text': 'Deine Überweisung konnte nicht gesendet werden.'
                },
                'transactionRequestFailed': {
                    'title': ' Überweisungs Anfrage fehlgeschlagen',
                    'text': 'Der blockchain.info Server konnte nicht erreicht werden, bitte versuche es später noch einmal.'
                },
                'passwordWrong': {
                    'title': ' Passwort falsch!',
                    'text': 'Das Passwort welches du eingegeben hast ist falsch, bitte versuche es noch einmal.'
                }
            },
            'info': {
                'noTransaction': {
                    'title': ' Du hast bisher keine Überweisung gesendet!',
                    'text': 'Warum sendest du nicht einfach eine Spende an dieses Projekt, um zu sehen wie es funktioniert?<br><a href="#" class="donate">17gH3YynN34VVRhwwrnEjfc31LnpP7rcTm</a>'
                },
                'noFunds': {
                    'title': ' Dein Portemonnaie ist leer!',
                    'text1': 'Überweise ein paar (milli) Bitcoin an deine Adresse um anzufangen:<br><a href="#" class="walletAddress" target="_blank"></a>',
                    'text2': 'Ich empfehle diese Addresse nicht für deine Ersparnisse zu verwenden. Am besten du sendest nur soviel wie du auch in deinem Portemonnaie tragen würdest.',
                    'text3': 'Um deinen Kontostand in USD anzuzeigen klicke einfach darauf.'
                }
            }
        },
        'settings': {
            'credits': 'Copyright by Fabian Vogelsteller [<a href="http://frozeman.de" target="_blank">frozeman.de</a>]<br>This software is open source and licensed under MIT license.<br><br>'+
                        'Website: <a href="http://frozeman.de/blog/2014/01/bitcoin-browser-wallet" target="_blank">frozeman.de/blog/2014/01/bitcoin-browser-wallet</a><br>'+
                        'Feedback: <a href="mailto:bitcoin@frozeman.de" target="_blank">bitcoin@frozeman.de</a><br>'+
                        'Bugs: <a href="http://github.com/frozeman/bitcoin-browser-wallet/issues" target="_blank">Github</a><br><br>'+
                        'Um dieses Projekt zu unterstützen sende einfach ein paar (milli) Bitcoin an <a href="#" class="donate">17gH3YynN34VVRhwwrnEjfc31LnpP7rcTm</a><br><br>'+
                        'Diese Software verwendet Google Analytics welche öffentlich zugänglich sind: <a href="http://www.seethestats.com/site/bitcoin-browser-wallet.com" target="_blank">seethestats.com</a>'+
                        '<i>Der Tracking-Code sitzt im background script der Erweiterung und kann nicht auf dein Wallet Popup zugreifen.</i>',
            
            'walletWillNotBeDeleted': 'Deine Schlüssel werden <strong>noch nicht</strong> gelöscht.<br>Entschlüssle bitte erst deinen privaten Schlüssel.',
            'decryptYourPrivateKey': 'Gib dein Passwort ein um deinen privaten Schlüssel zu entschlüsseln.',
            'privateKeyInfo': 'Dies ist der wichtigste Schlüssel deines Portemonnaies, passe gut darauf auf und zeige ihn zu niemanden!',
            'deleteWalletInfoText': '<strong>Dies wird deinen öffentlichen und privaten Schlüssel permanent löschen!</strong><br>'+
                                    'Schreibe deinen privaten Schlüssel auf um ihn mit einem anderen Portemonnaie zu verwenden,<br>'+
                                    ' oder sende alle Bitcoins zuerst zu einer anderen Adresse bevor du bestätigst!',
            'button': {
                'showPrivateKey': ' Zeige privaten Schlüssel',
                'deleteWallet': ' Lösche/Reset Portemonnaie',
            },
            'error': {
                'deletionFailed': {
                    'title': ' Portemonnaie konnte nicht gelöscht werden.'
                }
            }
        },
        'sendConfirm': {
            'send': 'Sende',
            'to': 'An',
            'feeHint': '0.0001 BTC Transaktionsgebühr wird noch hinzugefügt (vom Netzwerk benötigt).'
        },
        'success': {
            'transactionId': 'Transaktions ID:'
        }
    }
};