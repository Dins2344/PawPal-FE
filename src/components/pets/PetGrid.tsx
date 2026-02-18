import PetCard from "./PetCard";
import type { Pet } from "../../api/petApi";

function PetGrid({ pets }: { pets: Pet[] }) {
    return (
        <div className="grid gap-6 
                    grid-cols-1 
                    sm:grid-cols-2 
                    lg:grid-cols-3 
                    xl:grid-cols-4 xl:gap-8" >
            {pets.map((pet) => (
                <PetCard key={pet._id} pet={pet} />
            ))}
        </div>
    );
}

export default PetGrid;