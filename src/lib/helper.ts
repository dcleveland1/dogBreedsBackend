
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

export const encryptPassword = async (password : string) : Promise<string> => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
  }
export const matchPassword =  async (password : string, savedPassword : string):  Promise<boolean> => {
  let bla ;
  try{
    bla = await bcrypt.compare(password, savedPassword)
  }catch(e){
    console.log(e)
  }
  return bla
}

export const JwtVerifyHelper = async (authorization: string) => {
  let token = ''
  console.log(authorization)
  if(authorization && authorization.toLowerCase().startsWith('bearer')){
    token = authorization.substring(7)
  }

  console.log('before')
  let decodedToken
  try{
    decodedToken = jwt.verify(token, process.env.SECRET_q)
  }catch (e){
    console.log("CATCH",e)
    return {error: e}
  }

  console.log(token, decodedToken,  decodedToken.id)
  if(!token || !decodedToken.id){
    return {error: 'token missing or invalid'}
  }
  return decodedToken
}


