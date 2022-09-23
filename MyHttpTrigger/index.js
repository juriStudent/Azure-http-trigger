// CONFIG ---- Start with "http(s)://"" and end with a "/".
const URLDOMAIN = "https://jolly-plant-07b53cc03.1.azurestaticapps.net/";
let MASTERPASS = "TOP_MEGA_ULTRA_SECRET";
// CONFIG ----


module.exports = async function (context, req, databaseIN) {
    let lastKM = 0
    if (databaseIN.length != 0){
        databaseIN = databaseIN[0];
        lastKM = databaseIN.km;
    }
    // Otherwise lastKM stays 0, because the vehicle did not exist untill now.
    
    // Get the url parameters.
    let surName = (context.bindingData.surName).toLowerCase();
    let lastName = context.bindingData.lastName.toLowerCase();
    let vehicleCode = context.bindingData.vehicleCode;
    let vehicleDescription = context.bindingData.vehicleDescription;
    let km = context.bindingData.km;
    let transactionID = context.bindingData.transactionID;

    let timeID = new Date().getTime() / 1000; // // Milliseconds since Jan 1, 1970, 00:00:00.000 GMT

    // Admin wants to generate a link for the target.
    if (transactionID == MASTERPASS) {

        // If the entry is first, replace the value with the desired km.
        if (lastKM == 0){
            lastKM = km
        }

        // Fill in the template for the current worker.
        // Since the id is not given, Cosmos DB will generate a random unique one for the worker.
        databaseIN = {
            "timeID": timeID,
            "surName": surName,
            "lastName": lastName,
            "vehicleCode": vehicleCode,
            "km": lastKM,
            "vehicleDescription": vehicleDescription,
            "transactionID": randomCodeGenerator(10),
            "status": "new"
        }

        let url = generateLink(databaseIN, vehicleDescription, context);
        context.res = {
            body: url
        };
    }
    // Target is trying to save his km.
    else if (databaseIN.status =="new" && databaseIN.transactionID == transactionID) {
        // The km input is valid, update it.
        if (km > lastKM) {
            // update the user, his transactionID gets tagged as "EXPIRED".
            databaseIN = {
            "id":databaseIN.id,
            "timeID": timeID,
            "surName": databaseIN.surName,
            "lastName": databaseIN.lastName,
            "vehicleCode": databaseIN.vehicleCode,
            "km": km,
            "transactionID": "EXPIRED",
            "vehicleDescription": databaseIN.vehicleDescription,
            "status": "submitted"
        }

        addWorker(databaseIN, context)

        // The value that the user has given is ok!
        context.res = { body: `<meta http-equiv=\"refresh\" content=\"0; url=${URLDOMAIN}?${databaseIN.surName}?${databaseIN.lastName}?${databaseIN.vehicleCode}?${databaseIN.km}?${databaseIN.transactionID}?${databaseIN.vehicleDescription}?ok" />`, headers: { "Content-Type": "text/html" } };
        }
        else {
            // The value that the user has given is lower than what's in the database.
            context.res = { body: `<meta http-equiv=\"refresh\" content=\"0; url=${URLDOMAIN}?${databaseIN.surName}?${databaseIN.lastName}?${databaseIN.vehicleCode}?${databaseIN.km}?${databaseIN.transactionID}?${databaseIN.vehicleDescription}?low" />`, headers: { "Content-Type": "text/html" } };
        }
    } 
    else {
        context.res = {
            body: "INVALID transactionID"
        };
    }
}

function generateLink(databaseIN, vehicleDescription, context) {
   
    addWorker(databaseIN, context);
    
    // URL FOR THE WEBPAGE.
    let url = `${URLDOMAIN}?${databaseIN.surName}?${databaseIN.lastName}?${databaseIN.vehicleCode}?${databaseIN.km}?${databaseIN.transactionID}?${vehicleDescription}`;
    return url;
}

function randomCodeGenerator(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// make the values 'undefined' if you don't want them changed.
function addWorker(databaseIN, context) {
    context.bindings.workersOUT = JSON.stringify(databaseIN);
}






