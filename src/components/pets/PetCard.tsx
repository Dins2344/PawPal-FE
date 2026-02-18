import { Link } from "react-router-dom";
import type { Pet } from "../../api/petApi";

function PetCard({ pet }: { pet: Pet }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 overflow-hidden group border border-amber-100/30 hover:-translate-y-1">

            <div className="relative overflow-hidden">
                <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm
          ${pet.status === "available" && "bg-emerald-100/90 text-emerald-700"}
          ${pet.status === "pending" && "bg-amber-100/90 text-amber-700"}
          ${pet.status === "adopted" && "bg-rose-100/90 text-rose-700"}
        `}>
                    {pet.status}
                </span>
            </div>

            <div className="p-5 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-amber-700 transition-colors">
                    {pet.name}
                </h3>

                <p className="text-sm text-gray-500">
                    {pet.breed} • {pet.age} years
                </p>

                <Link
                    to={`/pets/${pet._id}`}
                    state={{ pet }}
                    className="w-full block mt-3 bg-linear-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 text-center font-semibold text-sm shadow-md shadow-amber-500/15"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}

export default PetCard;