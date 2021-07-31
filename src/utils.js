
function normalizeAmount(amount){
    if(typeof(amount) == "number"){
        return amount
    }
const response =  Number(amount.replace(/[^0-9.]/g,''));
return response;
}



module.exports.normalizeAmount = normalizeAmount;