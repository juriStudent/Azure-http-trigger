let worker = {
    name: "Cedric",
    vehicleCode: "ABC123",
    km: 1000,
    sessionID: "XYZZZZ"
}

module.exports = async function (context: any, req: any) {
    let MASTERPASS = "ikbenadmin"


    var name = context.bindingData.name;
    var vehicleCode = context.bindingData.vehicleCode;
    var km = context.bindingData.km;
    var sessionID = context.bindingData.sessionID;

    // admin wants to generate a link for the target.
    if (sessionID == MASTERPASS) {
        let url = generateLink(name, vehicleCode, km)

        context.res = {
            body: url
        }
    }
    // Target is trying to save his km.
    else {
        // Search for the worker's name and get his values.
        if (worker.sessionID == sessionID) {
            // update the database, remove the sessionID.
            // get the km.
            if (km < worker.km) {
                context.res = {
                    // send the same value back.
                    // redirect back to the same link, update the 
                    // Inject link into an html template???????
                    body: `http://127.0.0.1:5500/?${ worker.name }?${ worker.vehicleCode }?${ worker.km }?${ sessionID }`
                }
            }
            else {
                worker.sessionID == null
                // SQL update workers km
                worker.km = km

                context.res = {
                    body: `Worker's new km is: ${ worker.km }km`
                }
            }
        }
        else {
            // User's sessionID is not valid. Tell him his link is invalid.
        }
    }
}


function generateLink(name: string, vehicleCode: string, km: number) {
    let sessionID = randomCodeGenerator(10)

    //Search for the worker's name and get his values.

    //change the allowed sessionID.
    worker.sessionID = sessionID

    // http://localhost:7071/api/Cedric/adasdasd/123/ikbenadmin
    let url = `http://127.0.0.1:5500/?${ name }?${ worker.vehicleCode }?${ worker.km }?${ sessionID }`
    return url
}

function randomCodeGenerator(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}