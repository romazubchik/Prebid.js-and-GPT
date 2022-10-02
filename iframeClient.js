setTimeout(() => { 
    try {
        //Початкова конфігурація слотів на сторінці
        let gSlots = googletag.pubads().getSlots();
        let adUnits = pbjs.adUnits;

        let linkedSlots = gSlots.map(slot => {
            const path = slot.getAdUnitPath();
            let [, , code] = path.split('/');
            const adUnit = adUnits.find(unit => unit.code.includes(code));

            return {
                adUnitCode: adUnit?.code,
                adUnitPath: path,
                sizes: adUnit?.mediaTypes?.banner?.sizes,
                bidders: adUnit?.bids
            }
        })

        //Список SSP (бідерів), що взяли участь в аукціоні (Prebid.js)
        let allHighestBids = pbjs.getHighestCpmBids();
        let resultSSP = allHighestBids.map(e => {
            return {
                bidderName: e.bidder,
                cpm: e.cpm,
                currency: e.currency,
                size: e.size
            }
        })

        let iframe = document.createElement("iframe");
        let body = document.querySelector("body");
        iframe.width = "100%";
        iframe.height = "600px";
        iframe.src = `http://localhost:5000/iframe?adUnits=${JSON.stringify(linkedSlots)}&ssp=${JSON.stringify(resultSSP)}`;
        body.prepend(iframe);
    } catch (error) {
        let div = document.createElement("div");
        div.innerHTML = error;
        let body = document.querySelector('body');
        body.prepend(div);

    }

}, 5000) 


//Перехоплення URL-адресу всіх запитів, що були виконані через fetch() метод і виведення їх в консоль
const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
    let [resource, config] = args;
    console.log('resource', resource, resource.includes('localhost'))
    if (!resource.includes('localhost:5000')) {
        originalFetch('http://localhost:5000?fetchUrl=' + resource)
    }
    
    const response = await originalFetch(resource, config);
    
    return response;
};