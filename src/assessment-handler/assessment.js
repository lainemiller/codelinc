module.exports = function (requestObj) {
  const veteranObj = requestObj[0];
  console.log(veteranObj);
  const dataObj = [];
  for (const veteranProp in veteranObj) {
    dataObj.push({ key: veteranProp, value: veteranObj[veteranProp] });
  }
  console.log(dataObj);
  return { assessment_details: [{ header: 'personal information', data: dataObj }] };
};
