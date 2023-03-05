import React from 'react';
import { PetCard } from './PetCard';
import './SearchList.css'

export function SearchList({ filteredPets }) {
    const filtered = filteredPets.map(pet => <PetCard key={pet.id} pet={pet} />);
    return (
        <div className='pets-card'>
            {filtered}
        </div>
    );
}
