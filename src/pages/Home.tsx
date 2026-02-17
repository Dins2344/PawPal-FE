import PetFilters from "../components/pets/PetFilters"
import PetGrid from "../components/pets/PetGrid"



function Home() {

const  pets = [
  {
    "_id": "64b8c9e5f1a2c9b1d2e3f4a",
    "name": "Buddy",
    "breed": "Golden Retriever",
    "age": 3,
    "image": "/images/buddy.jpg",
    "status": "Available"
  },
  {
    "_id": "64b8c9e5f1a2c9b1d2e3f4b",
    "name": "Luna",
    "breed": "Siamese Cat",
    "age": 2,
    "image": "/images/luna.jpg",
    "status": "Available"
  },
  {
    "_id": "64b8c9e5f1a2c9b1d2e3f4c",
    "name": "Max",
    "breed": "German Shepherd",
    "age": 5,
    "image": "/images/max.jpg",
    "status": "Pending"
  },
   {
    "_id": "64b8c9e5f1a2c9b1d2e3f4a",
    "name": "Buddy",
    "breed": "Golden Retriever",
    "age": 3,
    "image": "/images/buddy.jpg",
    "status": "Available"
  },
  {
    "_id": "64b8c9e5f1a2c9b1d2e3f4b",
    "name": "Luna",
    "breed": "Siamese Cat",
    "age": 2,
    "image": "/images/luna.jpg",
    "status": "Available"
  },
  {
    "_id": "64b8c9e5f1a2c9b1d2e3f4c",
    "name": "Max",
    "breed": "German Shepherd",
    "age": 5,
    "image": "/images/max.jpg",
    "status": "Pending"
  },
    {
    "_id": "64b8c9e5f1a2c9b1d2e3f4b",
    "name": "Luna",
    "breed": "Siamese Cat",
    "age": 2,
    "image": "/images/luna.jpg",
    "status": "Available"
  },
  {
    "_id": "64b8c9e5f1a2c9b1d2e3f4c",
    "name": "Max",
    "breed": "German Shepherd",
    "age": 5,
    "image": "/images/max.jpg",
    "status": "Pending"
  },
   {
    "_id": "64b8c9e5f1a2c9b1d2e3f4a",
    "name": "Buddy",
    "breed": "Golden Retriever",
    "age": 3,
    "image": "/images/buddy.jpg",
    "status": "Available"
  },  {
    "_id": "64b8c9e5f1a2c9b1d2e3f4b",
    "name": "Luna",
    "breed": "Siamese Cat",
    "age": 2,
    "image": "/images/luna.jpg",
    "status": "Available"
  },
  {
    "_id": "64b8c9e5f1a2c9b1d2e3f4c",
    "name": "Max",
    "breed": "German Shepherd",
    "age": 5,
    "image": "/images/max.jpg",
    "status": "Pending"
  },
   {
    "_id": "64b8c9e5f1a2c9b1d2e3f4a",
    "name": "Buddy",
    "breed": "Golden Retriever",
    "age": 3,
    "image": "/images/buddy.jpg",
    "status": "Available"
  },  {
    "_id": "64b8c9e5f1a2c9b1d2e3f4b",
    "name": "Luna",
    "breed": "Siamese Cat",
    "age": 2,
    "image": "/images/luna.jpg",
    "status": "Available"
  },
  {
    "_id": "64b8c9e5f1a2c9b1d2e3f4c",
    "name": "Max",
    "breed": "German Shepherd",
    "age": 5,
    "image": "/images/max.jpg",
    "status": "Pending"
  },
   {
    "_id": "64b8c9e5f1a2c9b1d2e3f4a",
    "name": "Buddy",
    "breed": "Golden Retriever",
    "age": 3,
    "image": "/images/buddy.jpg",
    "status": "Available"
  },
]

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-1">
          <PetFilters />
        </div>

        <div className="lg:col-span-3">
          <PetGrid pets={pets} />
        </div>

      </div>
    </div>
  )
}

export default Home 