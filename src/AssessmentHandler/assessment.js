module.exports = function (requestObj){
    let retObj = [];
    const veteranObj = requestObj[0];
    console.log(veteranObj);
    const dataObj = [];
    for (const veteranProp in veteranObj) {
      dataObj.push({key: veteranProp, value: veteranObj[veteranProp]});
    }
    console.log(dataObj);
    return {assessment_details:[{header:"personal information",data:dataObj}]};
}