import { Link } from "react-router-dom";
import type { Pet } from "../../api/petApi";

function PetCard({ pet }: { pet: Pet }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden">

            <div className="relative">
                <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-52 object-cover"
                />

                <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full 
          ${pet.status === "available" && "bg-green-100 text-green-700"}
          ${pet.status === "pending" && "bg-yellow-100 text-yellow-700"}
          ${pet.status === "adopted" && "bg-red-100 text-red-700"}
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

                <Link
                    to={`/pets/${pet._id}`}
                    state={{ pet }}
                    className="w-full block mt-3 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition text-center"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}

export default PetCard;