import PetCard from "./PetCard";

function PetGrid({ pets }: { pets: Array<any> }) {
    return (
        <div className="grid gap-6 
                    grid-cols-1 
                    sm:grid-cols-2 
                    lg:grid-cols-3 
                    xl:grid-cols-4">
            {pets.map((pet) => (
                <PetCard key={pet._id} pet={pet} />
            ))}
        </div>
    );
}

export default PetGrid