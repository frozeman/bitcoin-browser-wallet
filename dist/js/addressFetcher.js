// thanks KryptoKit for the regex :), there is no license file in your repo,
// but you put in on github so i guess it is open source.

var str = document.documentElement.innerHTML,
    addresses = str.match(/[\s>&"\:][13][1-9A-HJ-NP-Za-km-z]{26,33}[\s<&"\?\.]/g),
    linkAddresses = str.match(/bitcoin:[13][1-9A-HJ-NP-Za-km-z]{26,33}\?&?amount=[0-9\.]+/g),
    btcAdresses = [];

addresses = _.union(addresses, linkAddresses);


for ( i in addresses ) {
    if(addresses[i]) {

        var foundAddress = addresses[i].match(/[13][1-9A-HJ-NP-Za-km-z]{26,33}/g);
        var foundAmount = addresses[i].match(/=[0-9\.]+/g);


        if(foundAmount)
            foundAmount = foundAmount[0].replace("=", "").replace(',','.');

        // add the address
        if(!_.find(btcAdresses, function(storedAddress){ return (storedAddress.address == foundAddress[0]) ? true : false; })) {
            btcAdresses.push({
                address: foundAddress[0],
                amount: (foundAmount) ? parseFloat(foundAmount) : 0
            });

        // add the amount, when already present
        } else if(foundAmount) {
            btcAdresses = _.map(btcAdresses, function(storedAddress){
                if (storedAddress.address == foundAddress[0]) {
                    storedAddress.amount = parseFloat(foundAmount);
                }

                return storedAddress;
            })
        }
    }
}


// send the adresses to the extension
chrome.runtime.sendMessage({btcAdresses: btcAdresses});
