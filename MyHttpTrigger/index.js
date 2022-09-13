"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let worker = {
    name: "Cedric",
    vehicleCode: "ABC123",
    km: 1000,
    sessionID: "XYZZZZ"
};
module.exports = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        let MASTERPASS = "ikbenadmin";
        var name = context.bindingData.name;
        var vehicleCode = context.bindingData.vehicleCode;
        var km = context.bindingData.km;
        var sessionID = context.bindingData.sessionID;
        // admin wants to generate a link for the target.
        if (sessionID == MASTERPASS) {
            let url = generateLink(name, vehicleCode, km);
            context.res = {
                body: url
            };
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
                        body: `KM LOWER THAN IN THE DATABASE - http://127.0.0.1:5500/?${worker.name}?${worker.vehicleCode}?${worker.km}?${sessionID}`
                    };
                }
                else {
                    worker.sessionID = randomCodeGenerator(10);
                    // SQL update workers km
                    worker.km = km;
                    context.res = {
                        body: `Worker's new km is: ${worker.km}km`
                    };
                }
            }
            else {
                context.res = {
                    body: "INVALID sessionID"
                };
                // User's sessionID is not valid. Tell him his link is invalid.
            }
        }
    });
};
function generateLink(name, vehicleCode, km) {
    let sessionID = randomCodeGenerator(10);
    //Search for the worker's name and get his values.
    //change the allowed sessionID.
    worker.sessionID = sessionID;
    // http://localhost:7071/api/Cedric/adasdasd/123/ikbenadmin
    let url = `http://127.0.0.1:5500/?${name}?${worker.vehicleCode}?${worker.km}?${sessionID}`;
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
