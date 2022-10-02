let dialog = document.querySelector("dialog");
let openDialog =  document.querySelector('#openDialog');
let closeDialog = document.querySelector('#closeDialog');

openDialog.addEventListener("click", function() {
    dialog.show(); 
})

closeDialog.addEventListener("click", function() {
    dialog.close();
})

function createTableForSSP (arrSSP) {
    for(let arr of arrSSP) {
        let createSSP = document.querySelector("#createSSP");
        let createTr = document.createElement("tr");    
    
        Object.values(arr).forEach(value => {   
            let td = document.createElement("td");
            td.innerHTML = value;
            createTr.appendChild(td);
        });
    
        createSSP.appendChild(createTr);
    }
}


function createTableForAdUnits(arr) {
    for(let arrey of arr) {
        let createAdUnits = document.querySelector("#createAdUnits");
        let createTr = document.createElement("tr");

        function createTd(arr) {
            let td = document.createElement("td");
            td.innerHTML = arr;
            createTr.appendChild(td);
        }

        createTd(arrey.adUnitCode);
        createTd(arrey.adUnitPath);

        let sizes = arrey.sizes;
        let arraySize = [];
        for(let i = 0; i < sizes.length; i++) {
            arraySize.push(sizes[i].join("x"));
        }
        arraySize.join(", ");
        createTd(arraySize);

        let bidders = arrey.bidders.join(', ');
        createTd(bidders);

        createAdUnits.appendChild(createTr);
    }
}

//Список SSP (бідерів), що взяли участь в аукціоні (Prebid.js)
let allHighestBids = pbjs.getHighestCpmBids();
let resultSSP = allHighestBids.map(e => {
    return{
        bidderName: e.bidder,
        cpm: e.cpm,
        currency: e.currency,
        size: e.size
    }
})

createTableForSSP(resultSSP);

//Початкова конфігурація слотів на сторінці
let gSlots = googletag.pubads().getSlots();
let adUnits = pbjs.adUnits;

let linkedSlots = gSlots.map(slot => {
    const path = slot.getAdUnitPath();
    let [ , , code ] = path.split('/');
    const adUnit = adUnits.find(unit => unit.code.includes(code));

    return {
        adUnitCode: adUnit?.code,
        adUnitPath: path,
        sizes: adUnit?.mediaTypes?.banner?.sizes,
        bidders: adUnit?.bids
    }
})

createTableForAdUnits(linkedSlots);

//Перехоплення URL-адресу всіх запитів, що були виконані через fetch() метод і виведення їх в консоль
const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
    let [resource, config ] = args;
    console.log('resource', resource, resource.includes('localhost'))
    if (!resource.includes('localhost:5000')) {
        originalFetch('http://localhost:5000?fetchUrl=' + resource)
    }
    
    const response = await originalFetch(resource, config);
    
    return response;
};