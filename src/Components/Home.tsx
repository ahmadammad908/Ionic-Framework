import React from 'react';
import Navbar from './Navbar';
import { IonHeader } from '@ionic/react';

interface HomeProps {
  handleCategoryClick: (category: string) => void;
  categories: { id: string; name: string }[];
  // Define your props interface for Home component
  // Assuming handleCategoryClick and categories are defined here

}

const Home: React.FC<HomeProps> = ({ handleCategoryClick, categories }) => {
  return (
    <div>
      <IonHeader>
      <Navbar handleCategoryClick={handleCategoryClick} categories={categories} />

      </IonHeader>
      {/* Passing handleCategoryClick and categories to Navbar */}
      {/* Other content of your Home component */}
    </div>
  );
};

export default Home;
