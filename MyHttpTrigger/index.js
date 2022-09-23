// CONFIG ---- 
let URLDOMAIN = "https://witty-rock-00a315803.1.azurestaticapps.net/"
// CONFIG ----


module.exports = async function (context, req, databaseIN) {
    let page = context.bindingData.page;


    let myJSON = ""
    if (page == false){
        URLDOMAIN = "https://witty-rock-00a315803.1.azurestaticapps.net/showLinks.html/"
        myJSON = (filterNew(databaseIN))
        
    }
    else{
        URLDOMAIN = "https://witty-rock-00a315803.1.azurestaticapps.net/index.html/"
        myJSON = (filterSubmitted(databaseIN))
    }

    context.res = {
        status: 200, 
        body: myJSON,
        headers: {'Content-Type': 'application/json'}
    }
}

function filterSubmitted(JSONArray) {
    let filteredArray = [];
    let i = 0;
    for (let i = 0; i < JSONArray.length; i++) {
        if (JSONArray[i].status == "submitted"){
            if (JSONArray[i] == "REMOVE") {
                continue;
            }

            let identifier = JSONArray[i].vehicleCode;
            JSONArray[i]["name"] = JSONArray[i].surName + " " + JSONArray[i].lastName
            filteredArray.push(JSONArray[i]);
            JSONArray[i] = "REMOVE";

            for (let i2 = 0; i2 < JSONArray.length; i2++) {

                let identifier2 = JSONArray[i2].vehicleCode;

                if (identifier == identifier2) {
                    JSONArray[i2] = "REMOVE";
                }
            }
        }
    }
    return filteredArray;
}

function filterNew(JSONArray) {

    let filteredArray = [];
    let i = 0;

    for (let i = 0; i < JSONArray.length; i++) {
        if (JSONArray[i].status == "new"){
            if (JSONArray[i] == "REMOVE") {
                continue;
            }

            let identifier = JSONArray[i].vehicleCode;
            JSONArray[i]["name"] = JSONArray[i].surName + " " + JSONArray[i].lastName
            // https://jolly-plant-07b53cc03.1.azurestaticapps.net/?{surname}?{lastname}?{vehicleCode}?0?2V5IVYPQ3T?{vehicleDescription}
            JSONArray[i]["link"] = "https://jolly-plant-07b53cc03.1.azurestaticapps.net/?" + JSONArray[i].surName + "?" + JSONArray[i].lastName + "?" + JSONArray[i].vehicleCode + "?" + JSONArray[i].km + "?" + JSONArray[i].transactionID + "?" + JSONArray[i].vehicleDescription



            filteredArray.push(JSONArray[i]);
            JSONArray[i] = "REMOVE";

            for (let i2 = 0; i2 < JSONArray.length; i2++) {

                let identifier2 = JSONArray[i2].vehicleCode;

                if (identifier == identifier2) {
                    JSONArray[i2] = "REMOVE";
                }
            }
        }
    }
    return filteredArray;
}






