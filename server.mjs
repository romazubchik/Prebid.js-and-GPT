import http from 'http'

const createHtmlTemplate = (ssp, adUnits) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" type="text/css" href="style.css">
        <style>
              body {
                background-size: cover;
              }
            
              dialog {
                background: rgba(255, 255, 255, 0.7);
                word-wrap: break-word;
                width: 95%; 
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                border-radius: 5px;
                
              }
            
              table, th, td {
                border: 1px solid black;
              }
            
              .color {
                font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
                font-size: 14px;
                border-collapse: collapse;
                text-align: center;
              }
            
              .color th, .color td:first-child {
                background: #47b4f8;
                color: white;
                padding: 10px 20px;
              }
            
              .color th, .color td {
                border-style: solid;
                border-width: 0 1px 1px 0;
                border-color: white;
              }
            
              .color td {
                background: #D8E6F3;
              }
            
              .color th:first-child, .color td:first-child {
                text-align: left;
              }
            
              .button {
                background-color: #47b4f8; 
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
              }
        </style>
      </head>
      <body>
        <button id="openDialog">Show Popup</button>
        <dialog>
          <table id="createSSP"> 
            <tr>
              <th>Bidder Name</th>
              <th>CPM</th>
              <th>Currency</th>
              <th>Size</th>
            </tr>
            ${ssp
              .map(
                (x) => 
                `<tr>
                  <th>${x.bidderName}</th>
                  <th>${x.cpm}</th>
                  <th>${x.currency}</th>
                  <th>${x.size}</th>
                 </tr>`,
              )
              .join('\n')}
          </table>
    
          <table id="createAdUnits"> 
            <tr>
              <th>Ad unit code</th>
              <th>Ad unit path</th>
              <th>Sizes</th>
              <th>Bidders</th>
            </tr>
            ${adUnits
              .map(
                (x) => `<tr>
                <th>${x.adUnitCode}</th>
                <th>${x.adUnitPath}</th>
                <th>${JSON.stringify(x.sizes)}</th>
                <th>${JSON.stringify(x.bidders)}</th>
            </tr>`,
              )
              .join('\n')}
          </table>
          <p><button id="closeDialog">Закрити вікно</button></p>
        </dialog>
    
      </body>
      <script>
        let dialog = document.querySelector("dialog");
        let openDialog =  document.querySelector('#openDialog');
        let closeDialog = document.querySelector('#closeDialog');

        openDialog.addEventListener("click", function() {
            dialog.show(); 
        })

        closeDialog.addEventListener("click", function() {
            dialog.close();
        })
      </script>
    </html>`
}

const server = http.createServer((req, res) => {
  const params = req.url.split('?')[1]

  if (req.url.startsWith('/iframe')) {
    const paramsArray = {}

    params.split('&').forEach((x) => {
      const [ key, value ] = x.split('=')

      paramsArray[key] = JSON.parse(decodeURI(value))
    })
    console.log('paramsArray', paramsArray)

    res.writeHead(200, {
      'Content-Type': 'text/html',
    })
    res.end(createHtmlTemplate(paramsArray.ssp || [], paramsArray.adUnits || []))
  } else {
    if (params) {
      console.log(params)
    }

    res.writeHead(200)
    res.end('ok')
  }
})

server.listen(5000, 'localhost', () => console.log('Lets go'))
