import React, { useEffect, useState } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import './dropdown.css'

function DropDown({ tableauLabelsProjet = [], onSelectionChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  // Filtrer les éléments basé sur la recherche
  useEffect(() => {
    const filtered = tableauLabelsProjet.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, tableauLabelsProjet]);

  useEffect(() => {
  if (onSelectionChange) {
    onSelectionChange(selectedItems);
  }
  
  }, [selectedItems, onSelectionChange]);

  // Gérer la sélection de tous les éléments
  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      // Désélectionner tous les éléments filtrés
      setSelectedItems(prev => 
        prev.filter(item => !filteredItems.includes(item))
      );
    } else {
      // Sélectionner tous les éléments filtrés
      setSelectedItems(prev => [
        ...prev.filter(item => !filteredItems.includes(item)),
        ...filteredItems.filter(item => !prev.includes(item))
      ]);
    }
  };

  // Gérer la sélection d'un élément individuel
  const handleItemSelect = (item) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  // Vérifier si tous les éléments filtrés sont sélectionnés
  const isAllSelected = filteredItems.length > 0 && 
    filteredItems.every(item => selectedItems.includes(item));

  // Vérifier si certains éléments filtrés sont sélectionnés
  const isSomeSelected = filteredItems.some(item => selectedItems.includes(item));

  return (
    <div className="dropdown-container">
      {/* Bouton principal du dropdown */}
      <button 
        className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="dropdown-text">
          {selectedItems.length === 0 
            ? 'Sélectionner des éléments'
            : `${selectedItems.length} élément(s) sélectionné(s)`
          }
        </span>
        <ChevronDown 
          className="dropdown-icon"
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
          size={20}
        />
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="dropdown-menu">
          {/* Barre de recherche */}
          <div className="search-container">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Case Select All */}
          {filteredItems.length > 0 && (
            <div className="dropdown-option select-all">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="checkbox-input"
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = !isAllSelected && isSomeSelected;
                    }
                  }}
                />
                <span className="checkbox-custom">
                  {isAllSelected && <Check size={12} />}
                </span>
                <span className="option-text font-semibold">
                  Tout sélectionner
                  {filteredItems.length !== tableauLabelsProjet.length && 
                    ` (${filteredItems.length})`
                  }
                </span>
              </label>
            </div>
          )}

          {/* Séparateur */}
          {filteredItems.length > 0 && <div className="dropdown-separator" />}

          {/* Liste des éléments */}
          <div className="dropdown-list">
            {filteredItems.length === 0 ? (
              <div className="no-results">
                {searchTerm ? 'Aucun résultat trouvé' : 'Aucun élément disponible'}
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <div key={index} className="dropdown-option">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleItemSelect(item)}
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom">
                      {selectedItems.includes(item) && <Check size={12} />}
                    </span>
                    <span className="option-text">{item}</span>
                  </label>
                </div>
              ))
            )}
          </div>

          {/* Footer avec compteur */}
          {selectedItems.length > 0 && (
            <div className="dropdown-footer">
              <span className="selection-count">
                {selectedItems.length} / {tableauLabelsProjet.length} sélectionné(s)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Overlay pour fermer le dropdown */}
      {isOpen && (
        <div 
          className="dropdown-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default DropDown;