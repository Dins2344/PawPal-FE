

function PetFilters() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">

            <input
                type="text"
                placeholder="Search by name..."
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <select className="w-full px-4 py-2 border rounded-xl">
                <option>All Species</option>
                <option>Dog</option>
                <option>Cat</option>
            </select>

            <select className="w-full px-4 py-2 border rounded-xl">
                <option>All Breeds</option>
            </select>

            <button className="w-full bg-gray-200 py-2 rounded-xl hover:bg-gray-300">
                Clear Filters
            </button>
        </div>
    )
}

export default PetFilters