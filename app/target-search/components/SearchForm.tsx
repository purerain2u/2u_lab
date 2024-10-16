import React, { useState } from 'react';
import styles from '../TargetSearch.module.css'; 

interface SearchFormProps {
  onSearch: (searchTerm: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어를 입력하세요"
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}>검색</button>
    </form>
  );
};

export default SearchForm;
