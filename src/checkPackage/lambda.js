// const provider = require('./fetchPackageInfo')
const provider = require('./helper')

module.exports.main = async (event, context) => {
  // console.log(event)
  // const { packageId, company } = event.body
  
  // const result = await provider.fetchPackageInfo(packageId, company)
  // console.log(JSON.stringify(result));

  // return result

  console.log(event)
  const response = { message: helper('World') };

  return response
}
