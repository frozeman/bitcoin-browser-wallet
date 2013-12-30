
// var interval = setInterval(function(){

    // fetch all bticoin address links
    var links =  $('a[href^="bitcoin:"]'),
        bitMonetLinks = $('#bitmonet-iframe'),
        btcAdresses = [];

    // uses bitmonet iframe (DOESNT WORK)
    if(bitMonetLinks.length > 0)
        links = bitMonetLinks.contents().find('a[href^="bitcoin:"]');

    if(links.length > 0) {
        // clearInterval(interval);

        _.each(links, function(link){
            var href = $(link).attr('href');

            if(href && href.indexOf('bitcoin:') != -1) {
                // get address
                href  = href.replace(/bitcoin\:/i,'').split('?');
                // get amount
                if(href[1]) {
                    href[1] = href[1].split('&');
                    href[1] = _.find(href[1], function(item){
                        return (item.indexOf('amount') != -1) ? true : false;
                    });
                    href[1] = (href[1]) ? href[1].split('=') : false;
                    href[1] = (href[1] && href[1][1]) ? href[1][1].replace(',','.') : 0;
                } else
                    href[1] = 0;

                btcAdresses.push({
                    address: href[0],
                    amount: parseFloat(href[1])
                });
            }
        });

        // console.log(links, btcAdresses);

        // send the adresses to the extension
        chrome.runtime.sendMessage({btcAdresses: btcAdresses});
    }
// }, 10000);