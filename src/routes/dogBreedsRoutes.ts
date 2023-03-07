
import axios from 'axios'
import express from 'express'

const suffleArray = (unshuffled:string[]) => (
  unshuffled.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
)

export const dogBreedsRouter = express.Router()
dogBreedsRouter.get('/random_image/:images', async (request, response) => {
  try {
    const images = await axios.get(`https://dog.ceo/api/breeds/image/random/${request.params.images}`)
    
    response.json(images.data)
    
  } catch (error) {
    response.status(408)
  }

})

dogBreedsRouter.post('/filters/:images', async (request, response) => {
  try {
    const { body } = request
    const { filters, page, numberOfImage } = body
    let filtersArray = JSON.parse(filters)
    let imagesArray :string[] =[]
    filtersArray = filtersArray.map( (element : {label:string, value:string}) => element.value)
    for(const element of filtersArray){
      const elementArray = element.split(" ")
      let url = ''
      if(elementArray.length === 2){
        url = `https://dog.ceo/api/breed/${elementArray[0]}/${elementArray[1]}/images`
      }else{
        url = `https://dog.ceo/api/breed/${elementArray[0]}/images`
      }
      const {data} = await axios.get(url)
      const {message} = data;
      imagesArray = [...message, ...imagesArray]

      
    };
    imagesArray = suffleArray(imagesArray).slice((page-1) * numberOfImage,(page) * numberOfImage + 1)
    console.log("LENGTH", imagesArray.length, imagesArray)
    response.json({ message:imagesArray, status:'success' })
    
  } catch (error) {
    response.status(408)
  }

})

dogBreedsRouter.get('/', async (request, response) => {
  try {
    const breeds = await axios.get(`https://dog.ceo/api/breeds/list/all`)
    console.log(breeds)
    response.json(breeds.data)
    
  } catch (error) {
    response.status(408)
  }

})