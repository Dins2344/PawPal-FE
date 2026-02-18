import { Link } from "react-router-dom";

function PetCard({ pet }: { pet: any }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden">

            <div className="relative">
                <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-52 object-cover"
                />

                <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full 
          ${pet.status === "Available" && "bg-green-100 text-green-700"}
          ${pet.status === "Pending" && "bg-yellow-100 text-yellow-700"}
          ${pet.status === "Adopted" && "bg-red-100 text-red-700"}
        `}>
                    {pet.status}
                </span>
            </div>

            <div className="p-5 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                    {pet.name}
                </h3>

                <p className="text-sm text-gray-500">
                    {pet.breed} • {pet.age} years
                </p>

                <Link to={`/pets/${pet._id}`} className="w-full block mt-3 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition text-center"> 
                    View Details
                </Link>
            </div>
        </div>
    )
}

export default PetCard